import React from 'react'

export default function ParticipantsTable({
  participants,
  onUpdateParticipant,
  onRemoveParticipant,
  onGenerate,
  loading
}) {
  const validCount = participants.filter(p => p.is_phone_valid).length
  const canGenerate = validCount >= 2

  return (
    <div>
      <h2>Participantes ({participants.length})</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Normalizado</th>
            <th>Válido</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, idx) => (
            <tr key={p.id} className={!p.is_phone_valid ? 'invalid' : ''}>
              <td>{idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) =>
                    onUpdateParticipant(p.id, 'name', e.target.value)
                  }
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={p.phone_raw}
                  onChange={(e) =>
                    onUpdateParticipant(p.id, 'phone_raw', e.target.value)
                  }
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <small>{p.phone_digits}</small>
              </td>
              <td>
                {p.is_phone_valid ? '✅' : '❌'}
              </td>
              <td>
                <button
                  onClick={() => onRemoveParticipant(p.id)}
                  style={{ background: '#dc3545' }}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row">
        <button onClick={onGenerate} disabled={!canGenerate || loading}>
          {loading ? 'Gerando...' : 'Gerar amigo secreto'}
        </button>
      </div>

      {!canGenerate && participants.length > 0 && (
        <div className="warning">
          Necessita pelo menos 2 participantes com telefones válidos
        </div>
      )}
    </div>
  )
}
