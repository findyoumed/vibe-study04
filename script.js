/* [LOG: 20260330_1717] - Firebase Integration */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8cQZ4xdbS5EOGPKuukVJbd4PRG5IXCh0",
    authDomain: "vibestudy-c9165.firebaseapp.com",
    projectId: "vibestudy-c9165",
    storageBucket: "vibestudy-c9165.firebasestorage.app",
    messagingSenderId: "998799540859",
    appId: "1:998799540859:web:a152200f139bc5a17058de",
    measurementId: "G-QZ991X3M3M",
    databaseURL: "https://vibestudy-c9165-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const todosRef = ref(db, 'todos');

/* [LOG: 20260330_1817] - Todo App Core Logic (Firebase Realtime DB) */

/**
 * 전역 상태 관리
 */
let todos = [];

/**
 * DOM 요소 선택
 */
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');
const dateDisplay = document.querySelector('#date-display');
const pendingCount = document.querySelector('#pending-count');
const clearAllBtn = document.querySelector('#clear-all');

/**
 * 초기화 단계
 */
document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    listenToDatabase();
});

/**
 * 실시간 데이터베이스 리스너
 * [LOG: 20260330_1817]
 */
function listenToDatabase() {
    onValue(todosRef, (snapshot) => {
        const data = snapshot.val();
        todos = data ? Object.values(data) : [];
        renderTodos();
    });
}

/**
 * 현재 날짜 표시
 */
function setCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('ko-KR', options);
}

/**
 * 할 일 추가
 * [LOG: 20260330_1817]
 */
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newId = Date.now();
    const newTodo = {
        id: newId,
        text: text,
        completed: false
    };

    // Firebase에 저장
    set(ref(db, 'todos/' + newId), newTodo);
    todoInput.value = '';
}

/**
 * 할 일 삭제
 * @param {number} id 
 * [LOG: 20260330_1817]
 */
function deleteTodo(id) {
    set(ref(db, 'todos/' + id), null);
}

/**
 * 상태 토글 (완료/미완료)
 * @param {number} id 
 * [LOG: 20260330_1817]
 */
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        set(ref(db, 'todos/' + id), { ...todo, completed: !todo.completed });
    }
}

/**
 * 할 일 수정
 * @param {number} id 
 * @param {string} newText 
 * [LOG: 20260330_1817]
 */
function editTodo(id, newText) {
    if (newText.trim() === '') return;
    const todo = todos.find(t => t.id === id);
    if (todo) {
        set(ref(db, 'todos/' + id), { ...todo, text: newText.trim() });
    }
}

/**
 * 전체 삭제
 * [LOG: 20260330_1817]
 */
function clearAll() {
    if (todos.length === 0) return;
    if (confirm('모든 할 일을 삭제하시겠습니까?')) {
        set(todosRef, null);
    }
}

/**
 * UI 렌더링
 */
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
            <span contenteditable="true" onblur="handleEdit(${todo.id}, this)">${todo.text}</span>
            <button class="btn-icon edit" onclick="focusElement(this)" title="수정">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon delete" onclick="deleteTodo(${todo.id})" title="삭제">
                <i class="fas fa-trash"></i>
            </button>
        `;
        todoList.appendChild(li);
    });

    // 통계 업데이트
    const pending = todos.filter(t => !t.completed).length;
    pendingCount.textContent = pending;
}

/**
 * 수정을 위한 포커스 (아이콘 클릭 시)
 */
window.focusElement = function (btn) {
    const span = btn.parentElement.querySelector('span');
    span.focus();
};

/**
 * 수정 핸들러 (blur 시 저장)
 */
window.handleEdit = function (id, span) {
    editTodo(id, span.textContent);
};

// 이벤트 리스너 연결
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearAllBtn.addEventListener('click', clearAll);

// 전역 함수로 노출 (onclick 핸들러에서 사용)
window.deleteTodo = deleteTodo;
window.toggleComplete = toggleComplete;
