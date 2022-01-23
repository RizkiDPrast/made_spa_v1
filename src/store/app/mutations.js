export function loaded(state) {
  state.loaded = true;
}

export function selectedRoom(state, room) {
  state.selectedRoom = Object.assign({}, room);
}

export function toggleMiniLeft(state, newVal) {
  state.miniLeft = typeof newVal === "undefined" ? !state.miniLeft : newVal;
}

export function hubRoom(state, model) {
  state.hubRoom = JSON.parse(JSON.stringify(model));
}

export function inPatientCount(state, count) {
  state.inPatientCount = count || 0;
}
