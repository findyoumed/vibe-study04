/* [LOG: 20260330_1717] - Firebase Integration */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnbmMVAv6SpptBeEapoI2MXGPDbCL9PJI",
    authDomain: "vibe-study04.firebaseapp.com",
    projectId: "vibe-study04",
    storageBucket: "vibe-study04.firebasestorage.app",
    messagingSenderId: "595097935377",
    appId: "1:595097935377:web:bdc6f62a509d160a56dbb0",
    measurementId: "G-3MS8Q9G30Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/* [LOG: 20260330_1640] - Todo App Core Logic */

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
    loadFromLocalStorage();
    setCurrentDate();
    renderTodos();
});

/**
 * 현재 날짜 표시
 * [LOG: 20260330_1640]
 */
function setCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('ko-KR', options);
}

/**
 * 할 일 추가
 * [LOG: 20260330_1640]
 */
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    saveToLocalStorage();
    renderTodos();
}

/**
 * 할 일 삭제
 * @param {number} id 
 * [LOG: 20260330_1640]
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

/**
 * 상태 토글 (완료/미완료)
 * @param {number} id 
 * [LOG: 20260330_1640]
 */
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveToLocalStorage();
    renderTodos();
}

/**
 * 할 일 수정
 * @param {number} id 
 * @param {string} newText 
 * [LOG: 20260330_1640]
 */
function editTodo(id, newText) {
    if (newText.trim() === '') return;
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: newText.trim() };
        }
        return todo;
    });
    saveToLocalStorage();
    renderTodos();
}

/**
 * 전체 삭제
 * [LOG: 20260330_1640]
 */
function clearAll() {
    if (todos.length === 0) return;
    if (confirm('모든 할 일을 삭제하시겠습니까?')) {
        todos = [];
        saveToLocalStorage();
        renderTodos();
    }
}

/**
 * 로컬 스토리지 저장
 * [LOG: 20260330_1640]
 */
function saveToLocalStorage() {
    localStorage.setItem('premium-todos', JSON.stringify(todos));
}

/**
 * 로컬 스토리지 로드
 * [LOG: 20260330_1640]
 */
function loadFromLocalStorage() {
    const stored = localStorage.getItem('premium-todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
}

/**
 * UI 렌더링
 * [LOG: 20260330_1640]
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
