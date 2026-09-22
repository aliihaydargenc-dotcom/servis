import test from 'node:test';
import assert from 'node:assert/strict';
import { haversineKm, boundingBox } from '../src/utils/geo.js';

test('haversine same point is zero',()=>assert.equal(haversineKm({latitude:36.88,longitude:30.70},{latitude:36.88,longitude:30.70}),0));
test('bounding box contains origin',()=>{const p={latitude:36.88,longitude:30.70};const b=boundingBox(p,8);assert.ok(b.south<p.latitude&&b.north>p.latitude&&b.west<p.longitude&&b.east>p.longitude);});
