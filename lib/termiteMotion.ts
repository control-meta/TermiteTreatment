export type ReadingArea = { left: number; right: number; top: number; bottom: number };

export function createTermiteMotion(index: number, seed = Math.floor(Math.random() * 0xffffffff)) {
  // Each insect owns its random stream: turning one cannot steer the other.
  let state = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const heading = (index % 2 ? -1 : 1) * Math.PI / 2 + (random() - .5) * .35;
  const speed = 8 + index * 3 + random() * 3;
  return {
    x: NaN, y: NaN, heading, target: heading,
    nextTurn: .8 + random() * 3, avoidUntil: 0,
    speed, targetSpeed: speed, turnRate: .8 + random() * .8,
    phase: random() * Math.PI * 2, gait: random() * Math.PI * 2, random,
  };
}

export type TermiteMotion = ReturnType<typeof createTermiteMotion>;

export function insideReadingArea(x: number, y: number, box: ReadingArea, padding = 24) {
  return x > box.left - padding && x < box.right + padding && y > box.top - padding && y < box.bottom + padding;
}

export function advanceTermite(motion: TermiteMotion, width: number, height: number, delta: number, elapsed: number, obstacles: ReadingArea[]) {
  const random = motion.random;
  const minX = Math.min(22, width / 2), maxX = Math.max(minX, width - 22);
  const minY = Math.min(80, height / 3), maxY = Math.max(minY, height - 82);
  if (elapsed >= motion.nextTurn && elapsed >= motion.avoidUntil) {
    motion.target = motion.heading + (random() - .5) * Math.PI * 1.8;
    motion.nextTurn = elapsed + 1.8 + random() * 5.2;
    motion.targetSpeed = 8 + random() * 8;
    motion.turnRate = .7 + random() * 1.1;
  }
  const difference = Math.atan2(Math.sin(motion.target - motion.heading), Math.cos(motion.target - motion.heading));
  motion.heading += Math.max(-delta * motion.turnRate, Math.min(delta * motion.turnRate, difference));
  motion.speed += (motion.targetSpeed - motion.speed) * Math.min(1, delta * .7);
  let nextX = motion.x + Math.cos(motion.heading) * motion.speed * delta;
  let nextY = motion.y + Math.sin(motion.heading) * motion.speed * delta;

  if ((nextX < minX || nextX > maxX || nextY < minY || nextY > maxY) && elapsed >= motion.avoidUntil) {
    // Reflect the individual path instead of steering both insects to the centre.
    let reflected = motion.heading;
    if (nextX < minX || nextX > maxX) reflected = Math.PI - reflected;
    if (nextY < minY || nextY > maxY) reflected = -reflected;
    motion.target = reflected + (random() - .5) * .45;
    motion.avoidUntil = elapsed + .6 + random() * .7;
    motion.nextTurn = motion.avoidUntil + 1 + random() * 3;
  }
  nextX = Math.max(minX, Math.min(maxX, nextX));
  nextY = Math.max(minY, Math.min(maxY, nextY));

  const blocked = obstacles.find(box => insideReadingArea(nextX, nextY, box));
  if (blocked) {
    const alreadyInside = insideReadingArea(motion.x, motion.y, blocked);
    if (elapsed >= motion.avoidUntil) {
      const distances = [Math.abs(motion.x - (blocked.left - 24)), Math.abs(motion.x - (blocked.right + 24)), Math.abs(motion.y - (blocked.top - 24)), Math.abs(motion.y - (blocked.bottom + 24))];
      const edge = distances.indexOf(Math.min(...distances));
      const outward = [Math.PI, 0, -Math.PI / 2, Math.PI / 2][edge];
      const side = random() < .5 ? -1 : 1;
      // In narrow margins, choose an independent up/down or left/right route.
      const narrowMargin = (edge === 0 && blocked.left - 24 < minX + 35) || (edge === 1 && blocked.right + 24 > maxX - 35);
      motion.target = alreadyInside ? outward : narrowMargin ? side * Math.PI / 2 : outward + side * (.7 + random() * .4);
      motion.avoidUntil = elapsed + .8 + random() * 1.3;
      motion.nextTurn = motion.avoidUntil + 1 + random() * 3;
    }
    // A moved reading block may cover an insect; let it crawl out while hidden.
    if (!alreadyInside) { nextX = motion.x; nextY = motion.y; }
  }
  motion.gait += Math.hypot(nextX - motion.x, nextY - motion.y) * .7;
  motion.x = nextX;
  motion.y = nextY;
}
