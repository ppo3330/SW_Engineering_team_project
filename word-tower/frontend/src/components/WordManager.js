import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WordManager = () => {
    const [words, setWords] = useState([]);
    const [formData, setFormData] = useState({ word: '', meaning: '' });
    const [editingId, setEditingId] = useState(null); // 현재 수정 중인 단어 ID

    const API_URL = "http://localhost:8080/api/words";

    // 1. 단어 목록 불러오기 (Read)
    const fetchWords = async () => {
        const res = await axios.get(API_URL);
        setWords(res.data);
    };

    useEffect(() => { fetchWords(); }, []);

    // 2. 입력값 변경 처리
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. 저장 버튼 클릭 (Create & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Update: PUT 요청
            await axios.put(`${API_URL}/${editingId}`, formData);
            setEditingId(null);
        } else {
            // Create: POST 요청
            await axios.post(API_URL, formData);
        }
        setFormData({ word: '', meaning: '' });
        fetchWords();
    };

    // 4. 수정 모드 진입
    const handleEdit = (word) => {
        setEditingId(word.id);
        setFormData({ word: word.word, meaning: word.meaning });
    };

    // 5. 삭제 처리 (Delete)
    const handleDelete = async (id) => {
        if (window.confirm("정말 삭제할까요?")) {
            await axios.delete(`${API_URL}/${id}`);
            fetchWords();
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Word Tower 단어 관리</h2>
            
            {/* 입력/수정 폼 */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    name="word" value={formData.word} 
                    onChange={handleChange} placeholder="단어" required 
                />
                <input 
                    name="meaning" value={formData.meaning} 
                    onChange={handleChange} placeholder="의미" required 
                />
                <button type="submit">
                    {editingId ? "수정 완료" : "단어 추가"}
                </button>
                {editingId && <button onClick={() => {setEditingId(null); setFormData({word:'', meaning:''});}}>취소</button>}
            </form>

            {/* 단어 리스트 테이블 */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>단어</th>
                        <th>의미</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map(w => (
                        <tr key={w.id}>
                            <td>{w.word}</td>
                            <td>{w.meaning}</td>
                            <td>
                                <button onClick={() => handleEdit(w)}>수정</button>
                                <button onClick={() => handleDelete(w.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WordManager;