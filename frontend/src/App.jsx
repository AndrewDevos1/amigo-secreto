import React, { useState } from 'react'
import axios from 'axios'
import PasteInput from './components/PasteInput'
import ParticipantsTable from './components/ParticipantsTable'
import AssignmentTable from './components/AssignmentTable'

export default function App() {
  const [participants, setParticipants] = useState([])
  const [groupName, setGroupName] = useState('')
  const [pairs, setPairs] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [defaultCC, setDefaultCC] = useState('55')

  async function handleParse(text) {
    setLoading(true)
    setErrors([])
    try {
      const resp = await axios.post('/api/parse', {
        text,
        default_country_code: defaultCC
      })
      setParticipants(resp.data.participants || [])
      setGroupName(resp.data.group_name || '')
      if (resp.data.errors && resp.data.errors.length > 0) {
        setErrors(resp.data.errors)
      }
    } catch (err) {
      setErrors(['Erro ao parsear: ' + (err.message || 'desconhecido')])
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (participants.length < 2) {
      setErrors(['Necessita pelo menos 2 participantes'])
      return
    }

    const hasInvalid = participants.some(p => !p.is_phone_valid)
    if (hasInvalid) {
      setErrors(['Há telefones inválidos. Corrija antes de gerar.'])
      return
    }

    setLoading(true)
    setErrors([])
    try {
      const resp = await axios.post('/api/generate', {
        participants,
        group_name: groupName
      })
      setPairs(resp.data.pairs || [])
    } catch (err) {
      setErrors(['Erro ao gerar: ' + (err.message || 'desconhecido')])
    } finally {
      setLoading(false)
    }
  }

  function handleUpdateParticipant(id, field, value) {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  function handleRemoveParticipant(id) {
    setParticipants(participants.filter(p => p.id !== id))
  }

  return (
    <div className="container">
      <h1>Amigo Secreto - Minimal</h1>

      {errors.length > 0 && (
        <div className="error">
          {errors.map((err, i) => <div key={i}>• {err}</div>)}
        </div>
      )}

      <PasteInput
        onParse={handleParse}
        groupName={groupName}
        onGroupNameChange={setGroupName}
        defaultCC={defaultCC}
        onDefaultCCChange={setDefaultCC}
        loading={loading}
      />

      {participants.length > 0 && (
        <ParticipantsTable
          participants={participants}
          onUpdateParticipant={handleUpdateParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          onGenerate={handleGenerate}
          loading={loading}
        />
      )}

      {pairs.length > 0 && (
        <AssignmentTable pairs={pairs} groupName={groupName} />
      )}
    </div>
  )
}
