---
title: "map"
tags: ["javascript", "map", "자료구조"]
category: "Javascript"
---

# map에 관해 궁금하시군요.

어떤 부분을 살펴보시겠습니까?

1. 개념과 기본구문  
2. 사용방법  
3. 실제 사용예시  
4. 주의해야할 점

---

## 1. 개념과 기본구문

**Map**은 키-값 쌍으로 데이터를 저장하는 자바스크립트 내장 객체입니다.  
키로 객체/문자열/숫자 등 다양한 타입을 쓸 수 있고,  
삽입 순서를 기억한다는 점에서 일반 객체(Object)와 다릅니다.

- **생성:**
```js
const myMap = new Map();
```

- **기본구조:**
```js
new Map([ [key1, value1], [key2, value2], ... ])
```

---

## 2. 사용방법

- **값 추가:**
```js
myMap.set("key", "value");
myMap.set(42, "meaning");
myMap.set({}, "object 키");
```

- **값 가져오기:**
```js
myMap.get("key");      // "value"
myMap.get(42);         // "meaning"
myMap.get({});         // undefined (참조 다름)
```

- **값 삭제/초기화:**
```js
myMap.delete("key");
myMap.clear();
```

- **반복:**
```js
for (const [k, v] of myMap) {
  console.log(k, v);
}
```

---

## 3. 실제 사용예시

- **1. 단어 등장 횟수 세기**
```js
const words = ["a", "b", "a", "c", "a", "b"];
const counter = new Map();
words.forEach(w => counter.set(w, (counter.get(w) || 0) + 1));
// 결과: Map { "a" => 3, "b" => 2, "c" => 1 }
```

- **2. 객체를 키로 활용**
```js
const objKey = {};
const map = new Map();
map.set(objKey, "오브젝트 키도 가능!");
console.log(map.get(objKey)); // "오브젝트 키도 가능!"
```

---

## 4. 주의해야할 점

- **객체/배열을 키로 쓸 때**  
  동일한 값이어도 "참조"가 다르면 다른 키로 취급
```js
map.set({}, 1);
map.get({}); // undefined (다른 객체)
```

- **Map은 삽입 순서를 기억**  
  → `for...of`, `forEach`에서 입력한 순서대로 값이 나온다.

- **Object와의 차이점**
  - Object는 문자열/심볼만 키로 사용  
  - Map은 모든 값(객체, 함수, NaN 등) 키로 사용 가능

---