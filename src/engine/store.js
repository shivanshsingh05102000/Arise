import { createDefaultState, normalizeState } from './defaults'

const memory = { state: createDefaultState() }

function api() {
  return window.arise?.store
}

export async function getState() {
  const saved = api() ? await api().get() : memory.state
  return normalizeState(saved, createDefaultState())
}

export async function saveState(state) {
  const normalized = normalizeState(state, createDefaultState())
  if (api()) await api().set(normalized)
  memory.state = normalized
  return normalized
}

export async function resetState() {
  if (api()) await api().reset()
  memory.state = createDefaultState()
  return memory.state
}

export async function getHistory(categoryKey) {
  const state = await getState()
  return state[categoryKey]?.history || []
}
