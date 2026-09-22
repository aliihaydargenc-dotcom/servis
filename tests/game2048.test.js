import test from 'node:test';
import assert from 'node:assert/strict';
import { move } from '../src/games/game2048.js';

test('2048 merges equal adjacent values',()=>{const b=[2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0];const originalRandom=Math.random;Math.random=()=>0;const next=move(b,'left');Math.random=originalRandom;assert.equal(next[0],4);});
