import React, { useState } from 'react'

export default function PasteInput({
  onParse,
  groupName,
  onGroupNameChange,
  defaultCC,
  onDefaultCCChange,
  loading
}) {
  const [text, setText] = useState('')

  function handleParse() {
    onParse(text)
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      handleParse()
    }
  }

  return (
    <div>
      <h2>Cole a lista de participantes</h2>
      <p>
        <label htmlFor="paste-text">
          Cole a lista (a primeira linha pode ser o título do grupo)
        </label>
      </p>
      <textarea
        id="paste-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Cole a lista aqui (ex: nome TAB telefone)..."
        disabled={loading}
      />

      <div className="row">
        <div>
          <label htmlFor="group-name">Nome do grupo:</label>
          <input
            id="group-name"
            type="text"
            value={groupName || ''}
            onChange={(e) => onGroupNameChange(e.target.value)}
            disabled={loading}
            placeholder="Amigo Secreto - Empresa XYZ"
          />
        </div>
        <div>
          <label htmlFor="default-cc">Código do país:</label>
          <input
            id="default-cc"
            type="text"
            value={defaultCC}
            onChange={(e) => onDefaultCCChange(e.target.value)}
            disabled={loading}
            placeholder="55"
            style={{ maxWidth: '120px' }}
          />
        </div>
      </div>

      <button onClick={handleParse} disabled={loading || !text.trim()}>
        {loading ? 'Parseando...' : 'Parsear'}
      </button>
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
        💡 Dica: Ctrl+Enter para parsear
      </p>
    </div>
  )
}
