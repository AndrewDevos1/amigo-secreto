import React, { useState } from 'react'

function makeWhatsappUrl(giver_digits, giver_name, receiver_name, receiver_phone, group_name) {
  const message = `Olá ${giver_name}! Você tirou ${receiver_name} no ${group_name || 'Amigo Secreto'}! Contato: ${receiver_phone}`
  return `https://wa.me/${giver_digits}?text=${encodeURIComponent(message)}`
}

export default function AssignmentTable({ pairs, groupName }) {
  const [messageTemplate, setMessageTemplate] = useState(
    'Olá {giver_name}! Você tirou {receiver_name} no {group_name}! Contato: {receiver_phone}'
  )

  if (!pairs || pairs.length === 0) return null

  function handleSendIndividual(giver_phone, giver_name, receiver_name, receiver_phone, receiver_display) {
    const url = makeWhatsappUrl(giver_phone, giver_name, receiver_name, receiver_display, groupName)
    window.open(url, '_blank')
  }

  function handleSendAll() {
    if (pairs.length > 5) {
      const confirmed = window.confirm(
        `Abrir ${pairs.length} abas do WhatsApp?\n\nO navegador pode bloquear popups. Recomenda-se enviar individualmente.`
      )
      if (!confirmed) return
    }

    pairs.forEach((pair, idx) => {
      setTimeout(() => {
        handleSendIndividual(
          pair.giver.phone_digits,
          pair.giver.name,
          pair.receiver.name,
          pair.receiver.phone_digits,
          pair.receiver.phone_raw
        )
      }, idx * 300)
    })
  }

  function handleCopyMessage(giver_name, receiver_name, receiver_phone) {
    const message = messageTemplate
      .replace('{giver_name}', giver_name)
      .replace('{receiver_name}', receiver_name)
      .replace('{group_name}', groupName || 'Amigo Secreto')
      .replace('{receiver_phone}', receiver_phone)

    navigator.clipboard.writeText(message)
    alert('Mensagem copiada!')
  }

  return (
    <div>
      <h2>Resultados — {groupName || 'Amigo Secreto'}</h2>

      <div className="row">
        <button onClick={handleSendAll} style={{ background: '#25d366' }}>
          Enviar todos por WhatsApp
        </button>
      </div>

      <div>
        <label htmlFor="msg-template">Template da mensagem (editável):</label>
        <textarea
          id="msg-template"
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          rows={3}
        />
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Use: {'{giver_name}'}, {'{receiver_name}'}, {'{group_name}'}, {'{receiver_phone}'}
        </p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Quem envia</th>
              <th>Telefone</th>
              <th>Recebe</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{pair.giver.name}</td>
                <td>
                  <small>{pair.giver.phone_raw}</small>
                </td>
                <td>{pair.receiver.name}</td>
                <td>
                  <button
                    onClick={() =>
                      handleSendIndividual(
                        pair.giver.phone_digits,
                        pair.giver.name,
                        pair.receiver.name,
                        pair.receiver.phone_digits,
                        pair.receiver.phone_raw
                      )
                    }
                    style={{ background: '#25d366', marginRight: '5px' }}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      handleCopyMessage(
                        pair.giver.name,
                        pair.receiver.name,
                        pair.receiver.phone_raw
                      )
                    }
                    style={{ background: '#6c757d' }}
                  >
                    Copiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
        <strong>Nota:</strong> O botão WhatsApp abre o chat do GIVER (quem recebe a mensagem com quem tirou).
        Recomenda-se enviar individualmente para evitar bloqueio de popups.
      </p>
    </div>
  )
}
