export function newBoard() {
  const b = Array(16).fill(0);
  return addTile(addTile(b));
}

export function addTile(board) {
  const empty = board.map((v, i) => v === 0 ? i : -1).filter((i) => i >= 0);
  if (!empty.length) return [...board];
  const next = [...board];
  const index = empty[Math.floor(Math.random() * empty.length)];
  next[index] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slide(line) {
  const vals = line.filter(Boolean);
  const out = [];
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); i++; }
    else out.push(vals[i]);
  }
  while (out.length < 4) out.push(0);
  return out;
}

export function move(board, direction) {
  const get = (r, c) => board[r * 4 + c];
  const next = Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
    let line;
    if (direction === 'left' || direction === 'right') line = [0,1,2,3].map((c) => get(i, c));
    else line = [0,1,2,3].map((r) => get(r, i));
    if (direction === 'right' || direction === 'down') line.reverse();
    line = slide(line);
    if (direction === 'right' || direction === 'down') line.reverse();
    for (let j = 0; j < 4; j++) {
      if (direction === 'left' || direction === 'right') next[i * 4 + j] = line[j];
      else next[j * 4 + i] = line[j];
    }
  }
  return next.every((v, i) => v === board[i]) ? board : addTile(next);
}
