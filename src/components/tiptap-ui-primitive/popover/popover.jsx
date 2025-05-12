"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingFocusManager,
  limitShift,
  FloatingPortal,
} from "@floating-ui/react"
import "@/components/tiptap-ui-primitive/popover/popover.scss"

const PopoverContext = React.createContext(null)

function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be wrapped in <Popover />")
  }
  return context
}

function usePopover({
  initialOpen = false,
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen)
  const [labelId, setLabelId] = React.useState()
  const [descriptionId, setDescriptionId] = React.useState()
  const [currentPlacement, setCurrentPlacement] = React.useState(`${side}-${align}`)
  const [offsets, setOffsets] = React.useState({ sideOffset, alignOffset })

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const middleware = React.useMemo(() => [
    offset({
      mainAxis: offsets.sideOffset,
      crossAxis: offsets.alignOffset,
    }),
    flip({
      fallbackAxisSideDirection: "end",
      crossAxis: false,
    }),
    shift({
      limiter: limitShift({ offset: offsets.sideOffset }),
    }),
  ], [offsets.sideOffset, offsets.alignOffset])

  const floating = useFloating({
    placement: currentPlacement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  })

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context),
    useRole(floating.context),
  ])

  const updatePosition = React.useCallback(
    (newSide, newAlign, newSideOffset, newAlignOffset) => {
      const nextPlacement = `${newSide}-${newAlign}`;
      // placement가 바뀔 때만 업데이트
      if (nextPlacement !== currentPlacement) {
        setCurrentPlacement(nextPlacement);
      }

      // offsets가 실제로 바뀌었을 때만 업데이트
      setOffsets((prev) => {
        const updated = { ...prev };
        let changed = false;

        if (
          newSideOffset !== undefined &&
          newSideOffset !== prev.sideOffset
        ) {
          updated.sideOffset = newSideOffset;
          changed = true;
        }
        if (
          newAlignOffset !== undefined &&
          newAlignOffset !== prev.alignOffset
        ) {
          updated.alignOffset = newAlignOffset;
          changed = true;
        }

        return changed ? updated : prev;
      });
    },
    [currentPlacement], // offsets 빼고 placement만 의존
  );


  return React.useMemo(() => ({
    open,
    setOpen,
    ...interactions,
    ...floating,
    modal,
    labelId,
    descriptionId,
    setLabelId,
    setDescriptionId,
    updatePosition,
  }), [
    open,
    setOpen,
    interactions,
    floating,
    modal,
    labelId,
    descriptionId,
    updatePosition,
  ]);
}

function Popover({
  children,
  modal = false,
  ...options
}) {
  const popover = usePopover({ modal, ...options })
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

const PopoverTrigger = React.forwardRef(function PopoverTrigger(
  { children, asChild = false, ...props },
  propRef
) {
  const context = usePopoverContext();

  // 👉 children.ref 가 문자열이 아닌 경우만 병합
  let childrenRef;
  if (React.isValidElement(children)) {
    const ref = children.ref;
    if (typeof ref !== "string") {
      childrenRef = ref;
    }
  }

  // 👉 모든 ref 병합
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // 👉 children이 React 엘리먼트라면 클론, 아니면 버튼
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...props,
      ...children.props,
      "data-state": context.open ? "open" : "closed",
      ...context.getReferenceProps(),
    });
  }

  return (
    <button
      ref={ref}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

const PopoverContent = React.forwardRef(function PopoverContent(
  {
    className,
    side = "bottom",
    align = "center",
    sideOffset,
    alignOffset,
    style,
    portal = true,
    portalProps = {},
    asChild = false,
    children,
    ...props
  },
  propRef
) {
  const context = usePopoverContext();

  // 💡 children.ref 안전하게 추출
  let childrenRef;
  if (React.isValidElement(children)) {
    const ref = children.ref;
    if (typeof ref !== "string") {
      childrenRef = ref;
    }
  }

  const ref = useMergeRefs([
    context?.refs?.setFloating,
    propRef,
    childrenRef,
  ]);

  // 💣 context 또는 open 상태 체크
  if (!context || !context.context?.open) return null;

  // 💡 위치 업데이트
  React.useEffect(() => {
    context.updatePosition(side, align, sideOffset, alignOffset);
  }, [context, side, align, sideOffset, alignOffset]);

  const contentProps = {
    ref,
    style: {
      position: context.strategy,
      top: context.y ?? 0,
      left: context.x ?? 0,
      ...style,
    },
    "aria-labelledby": context.labelId,
    "aria-describedby": context.descriptionId,
    className: `tiptap-popover ${className || ""}`,
    "data-side": side,
    "data-align": align,
    "data-state": context.context.open ? "open" : "closed",
    ...context.getFloatingProps(props),
  };

  const content = asChild && React.isValidElement(children)
    ? React.cloneElement(children, {
        ...contentProps,
        ...(children.props || {}),
      })
    : <div {...contentProps}>{children}</div>;

  const wrapped = (
    <FloatingFocusManager context={context.context} modal={context.modal}>
      {content}
    </FloatingFocusManager>
  );

  return portal
    ? <FloatingPortal {...portalProps}>{wrapped}</FloatingPortal>
    : wrapped;
});

PopoverTrigger.displayName = "PopoverTrigger"
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
