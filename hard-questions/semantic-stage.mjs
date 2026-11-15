/* Small, legible physical scenes for the teaching beats. Built independently
   from the editorial Three.js sets so people and actions stay easy to read. */
import * as T from './vendor/three.module.js';

const colors = {
  ground: '#f5eddb', green: '#255347', ink: '#173e34', mint: '#7eaa8d',
  gold: '#c49a51', terra: '#b96f55', blue: '#7396a5', paper: '#fff9e9',
  oak: '#b28252', dark: '#203c37', sky: '#dce5d9', smoke: '#87938a'
};
const ease = value => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
const mats = new Map();
function material(color) {
  if (!mats.has(color)) mats.set(color, new T.MeshStandardMaterial({ color, roughness: .78 }));
  return mats.get(color);
}
function box(parent, x, y, z, w, h, d, color, radius = .04) {
  const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material(color));
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  return mesh;
}
function sphere(parent, x, y, z, r, color, sx = 1, sy = 1, sz = 1) {
  const mesh = new T.Mesh(new T.SphereGeometry(r, 20, 14), material(color));
  mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; parent.add(mesh);
  return mesh;
}
function rod(parent, a, b, radius, color) {
  const from = new T.Vector3(...a), to = new T.Vector3(...b), delta = to.clone().sub(from);
  const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, delta.length(), 12), material(color));
  mesh.position.copy(from.add(to).multiplyScalar(.5));
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
  mesh.castShadow = true; parent.add(mesh); return mesh;
}
function sign(parent, text, x, y, z, w = 1.05, h = .29) {
  // Teaching copy lives in the high-contrast canvas overlay, not on tiny set props.
  return null;
}
function person(parent, x, z, height = 1.7, clothes = colors.terra, name = '') {
  const g = new T.Group(); g.position.set(x, 0, z); parent.add(g);
  const torsoH = height * .43, headY = height * .83;
  const torso = box(g, 0, height * .45, 0, height * .34, torsoH, .28, clothes);
  sphere(g, 0, headY, .01, height * .14, '#d4a47f', 1, 1.04, .9);
  sphere(g, -.052 * height, headY + .015 * height, .13, .018 * height, colors.ink);
  sphere(g, .052 * height, headY + .015 * height, .13, .018 * height, colors.ink);
  const armA = rod(g, [-height * .16, height * .63, .02], [-height * .29, height * .39, .13], height * .045, clothes);
  const armB = rod(g, [height * .16, height * .63, .02], [height * .29, height * .39, .13], height * .045, clothes);
  rod(g, [-height * .09, height * .24, 0], [-height * .11, .06, 0], height * .055, colors.dark);
  rod(g, [height * .09, height * .24, 0], [height * .11, .06, 0], height * .055, colors.dark);
  if (name) sign(g, name, 0, height + .22, .1, Math.min(1.8, Math.max(.8, name.length * .085)), .26);
  return { group: g, torso, arms: [armA, armB], height };
}
function tree(parent, x, z, scale = 1, bare = false) {
  rod(parent, [x, .08, z], [x, 1.15 * scale, z], .09 * scale, colors.oak);
  for (let i = 0; i < 3; i++) {
    const y = (.95 + i * .34) * scale;
    if (!bare) sphere(parent, x + (i - 1) * .22 * scale, y, z, .39 * scale, i % 2 ? colors.mint : colors.green, 1, 1.02, .9);
    else rod(parent, [x, y - .25, z], [x + (i - 1) * .34, y + .22, z], .025, colors.smoke);
  }
}
function home(parent, x, z, scale = 1) {
  box(parent, x, .62 * scale, z, 1.2 * scale, 1.12 * scale, .9 * scale, colors.paper);
  const roof = new T.Mesh(new T.ConeGeometry(.93 * scale, .68 * scale, 4), material(colors.terra));
  roof.position.set(x, 1.45 * scale, z); roof.rotation.y = Math.PI / 4; roof.castShadow = true; parent.add(roof);
  box(parent, x, .35 * scale, z + .47 * scale, .28 * scale, .68 * scale, .08, colors.green);
  box(parent, x + .36 * scale, .84 * scale, z + .48 * scale, .28 * scale, .3 * scale, .06, colors.blue);
}
function aiTerminal(parent) {
  const g = new T.Group(); g.position.set(2.85, 0, -1.4); parent.add(g);
  box(g, 0, .9, 0, 1.35, 1.08, .28, colors.green);
  box(g, 0, .92, .17, 1.12, .76, .05, colors.dark);
  sign(g, 'AI', 0, .96, .205, .72, .42);
  box(g, 0, .25, .02, .65, .14, .56, colors.oak);
  sign(g, 'TOOL', 0, .08, .31, .75, .22, colors.paper);
  return g;
}
function createProp(parent, visual) {
  const g = new T.Group(); g.position.set(0, 0, .35); parent.add(g);
  const moving = [], indicators = [], smoke = [], foliage = [];
  if (visual === 'diagnosis' || visual === 'waiting') {
    box(g, -.1, .13, 0, 2.5, .18, 1.15, colors.oak);
    for (let i = 0; i < 4; i++) box(g, -.78 + i * .45, .27, 0, .34, .035, .72, i === 0 ? colors.terra : colors.paper, .01);
    if (visual === 'waiting') {
      for (let i = 0; i < 6; i++) {
        const card = box(g, -.95 + i * .38, .31, -.05, .25, .42, .22, i < 5 ? colors.terra : colors.mint);
        card.scale.y = .001; moving.push(card);
      }
      sign(g, '6 YEARS', 0, 1.1, .16, 1.8, .3);
    } else {
      box(g, .65, .9, -.05, .72, 1.08, .16, colors.green);
      box(g, .65, .91, .05, .58, .74, .035, colors.dark);
      sign(g, 'MEDICAL', .65, .92, .09, .52, .2);
      sign(g, 'RECORDS', -.35, .55, .4, .9, .24);
    }
  } else if (visual === 'family' || visual === 'time' || visual === 'connection') {
    home(g, -1.65, -.3, .9); tree(g, -2.65, -.55, .8);
    box(g, .55, .48, .2, 1.55, .12, .8, colors.oak);
    for (const x of [.02, 1.08]) for (const z of [-.07, .47]) rod(g, [x, .42, z], [x, .06, z], .04, colors.green);
    if (visual === 'time') {
      const clock = new T.Mesh(new T.CylinderGeometry(.46, .46, .1, 32), material(colors.paper));
      clock.position.set(2, 1.1, -.3); clock.rotation.x = Math.PI / 2; g.add(clock);
      sign(g, 'TIME', 2, 1.1, -.19, .7, .24);
    }
    if (visual === 'connection') {
      rod(g, [-.3, 1.25, .3], [.35, 1.25, .3], .035, colors.gold);
      sphere(g, .02, 1.25, .3, .11, colors.terra);
    }
  } else if (visual === 'control') {
    box(g, 0, .32, 0, 1.6, .55, 1.2, colors.dark);
    sign(g, 'USE', -.48, .38, .62, .55, .28, colors.green);
    sign(g, 'MISUSE?', .48, .38, .62, .73, .28, colors.terra);
    for (let i = 0; i < 3; i++) indicators.push(sphere(g, -.48 + i * .48, .78, 0, .12, i === 1 ? colors.gold : colors.mint));
  } else if (visual === 'infrastructure') {
    for (let i = 0; i < 3; i++) {
      box(g, -1.1 + i * .72, .86, -.15, .56, 1.55, .65, colors.dark);
      for (let j = 0; j < 4; j++) box(g, -1.1 + i * .72, .35 + j * .3, .19, .4, .12, .04, j === 3 ? colors.gold : colors.mint);
    }
    home(g, 1.55, .12, .72); sign(g, 'DATA CENTER', 0, 1.9, .1, 1.9, .3);
  } else if (visual === 'mission') {
    box(g, -.9, .8, 0, 1.3, 1.5, .85, colors.blue);
    box(g, -.9, 1.58, 0, 1.7, .18, 1.05, colors.terra);
    sign(g, 'MISSION?', -.9, 1.06, .45, 1.05, .32);
  } else if (visual === 'thinking' || visual === 'research') {
    if (visual === 'thinking') {
      // A four-piece puzzle with a clear open slot; the last piece is solved in view.
      box(g, -.2, .21, .05, 1.24, .12, 1.05, colors.oak);
      moving.push(box(g, -.55, .43, .02, .42, .3, .42, colors.terra));
      moving.push(box(g, -.1, .43, .02, .42, .3, .42, colors.blue));
      moving.push(box(g, -.55, .43, .47, .42, .3, .42, colors.gold));
      const piece = box(g, 1.05, .85, .15, .42, .3, .42, colors.green);
      moving.push(piece);
    } else {
      for (let i = 0; i < 4; i++) moving.push(box(g, -.95 + i * .58, .22, .1, .48, .28 + (i % 2) * .12, .5, [colors.terra, colors.blue, colors.gold, colors.green][i]));
      for (let i = 0; i < 3; i++) box(g, -.55 + i * .48, .58, .03, .42, .26, .42, colors.paper);
    }
    if (visual === 'research') {
      const lens = new T.Mesh(new T.CylinderGeometry(.3, .45, .65, 24), material(colors.green));
      lens.position.set(1.7, 1.22, 0); lens.rotation.z = -.42; g.add(lens);
      rod(g, [1.7, .85, 0], [1.7, .1, 0], .09, colors.oak);
      sphere(g, 2.45, .9, .1, .14, colors.blue); sphere(g, 2.8, 1.3, .1, .12, colors.gold);
      rod(g, [2.45, .9, .1], [2.8, 1.3, .1], .025, colors.gold);
    }
  } else if (visual === 'writing') {
    box(g, -.4, .62, .12, 2.25, .14, 1.1, colors.oak);
    moving.push(box(g, -.72, .74, .22, .78, .025, .62, colors.paper));
    for (let i = 0; i < 3; i++) box(g, -.72, .77, -.02 + i * .16, .54, .01, .015, colors.blue, .002);
    sign(g, 'IDEA', -.72, .99, .2, .6, .22);
    rod(g, [-1.2, .8, .3], [-.95, .8, .3], .025, colors.gold);
  } else if (visual === 'work' || visual === 'tasks') {
    box(g, -.15, .45, .15, 2.5, .13, .8, colors.oak);
    for (let i = 0; i < 3; i++) moving.push(box(g, -.95 + i * .72, .76, .13, .48, .48, .42, i === 2 ? colors.mint : colors.terra));
    sign(g, visual === 'work' ? 'HUMAN WORK' : 'TEDIOUS TASKS', -.15, 1.18, .2, 1.95, .3);
  } else if (visual === 'growing' || visual === 'creativity') {
    for (let i = 0; i < 3; i++) {
      const x = -1.65 + i * 1.55;
      if (visual === 'growing') person(g, x, .15, .88 + i * .28, [colors.terra, colors.blue, colors.green][i]);
      else {
        const block = box(g, x, .37, .1, .65, .72, .55, [colors.terra, colors.blue, colors.gold][i]);
        moving.push(block);
        box(g, x + .3, .9, .08, .38, .35, .48, colors.mint);
      }
    }
    if (visual === 'creativity') sign(g, 'MAKE / IMAGINE', 0, 1.55, .15, 2.2, .32);
  } else if (visual === 'isolation' || visual === 'empathy') {
    const barriers = [];
    for (let i = 0; i < 3; i++) {
      const x = -1.15 + i * 1.15;
      if (visual === 'isolation') {
        const barrier = new T.Group(); barrier.position.x = x; g.add(barrier);
        box(barrier, 0, .95, 0, .72, .92, .12, colors.blue);
        box(barrier, 0, .98, .08, .55, .65, .035, colors.dark);
        barriers.push(barrier);
      } else {
        sphere(g, x, .9, .15, .21, [colors.terra, colors.gold, colors.blue][i]);
        rod(g, [x, .65, .15], [x, .08, .15], .09, colors.green);
        if (i < 2) rod(g, [x + .15, .63, .2], [x + .85, .63, .2], .035, colors.gold);
      }
    }
    if (visual === 'isolation') moving.push(...barriers);
    if (visual === 'empathy') sign(g, 'PERSON TO PERSON', 0, 1.58, .22, 2.5, .32);
  } else if (visual === 'access') {
    home(g, 1.65, -.1, .78);
    const ramp = box(g, -.4, .5, .3, 2.2, .12, 1.1, colors.oak); ramp.rotation.z = -.16;
    for (const z of [-.15, .75]) rod(g, [-1.45, .52, z], [.68, .9, z], .025, colors.gold);
    const wheel = new T.Mesh(new T.TorusGeometry(.34, .045, 8, 24), material(colors.green));
    wheel.position.set(-1.8, .48, .2); g.add(wheel);
    box(g, -1.8, .75, .2, .5, .08, .5, colors.blue);
    sign(g, 'ACCESS', .45, 1.32, .35, 1.1, .3);
  } else if (visual === 'environment' || visual === 'nature' || visual === 'balance') {
    for (let i = 0; i < 3; i++) {
      tree(g, -1.4 + i * .72, .2, .65);
      foliage.push(...g.children.filter(child => child.geometry?.type === 'SphereGeometry').slice(-3));
    }
    if (visual !== 'nature') {
      box(g, 1.35, .8, .1, .75, 1.45, .6, colors.dark);
      for (let i = 0; i < 3; i++) box(g, 1.35, .48 + i * .32, .42, .5, .1, .04, colors.mint);
      if (visual === 'environment') for (let i = 0; i < 2; i++) smoke.push(sphere(g, 1.15 + i * .45, 1.75 + i * .2, .1, .22, colors.smoke, 1.3, .8, 1));
    }
    if (visual === 'balance') {
      rod(g, [-1.75, .32, -.5], [1.75, .32, -.5], .06, colors.gold);
      sign(g, 'COMMUNITY', -1.25, .8, -.3, 1.3, .26);
      sign(g, 'TECHNOLOGY', 1.2, .8, -.3, 1.35, .26);
    }
  } else if (visual === 'independence' || visual === 'path' || visual === 'support') {
    home(g, 1.7, -.2, .78); tree(g, -2, -.3, .75);
    for (let i = 0; i < 4; i++) moving.push(box(g, -.85 + i * .58, .12 + i * .17, .28, .58, .18, .78, colors.gold));
    if (visual === 'independence') {
      box(g, -.35, 1.02, -.15, .55, .48, .12, colors.blue);
      sign(g, 'DAILY SUPPORT', -.35, 1.04, -.07, 1.2, .26);
    }
    if (visual === 'support') {
      box(g, -2.05, 1.24, -.25, .95, .9, .12, colors.green);
      sign(g, 'TEACH', -2.05, 1.25, -.17, .72, .27);
    }
  }
  g.userData.semanticUpdate = (action, seconds, reduced) => {
    const t = reduced ? 6 : seconds;
    if (visual === 'waiting') {
      const progress = reduced ? 0 : Math.max(0, Math.min(1, (t - 8.96) / (10.88 - 8.96)));
      moving.forEach((card, i) => {
        const reveal = action === 'answer' ? 1 : ease(progress * 6 - i);
        card.scale.y = Math.max(.001, reveal);
        card.position.y = .31 + .21 * reveal;
      });
    }
    if (visual === 'thinking' && moving.length >= 4) {
      const solved = action === 'learning';
      const piece = moving[3];
      piece.position.x = solved ? -.1 : 1.05;
      piece.position.z = solved ? .47 : .15;
      piece.position.y = solved ? .43 : .85;
      piece.rotation.y = reduced || !solved ? 0 : .08 * Math.sin(t * 2);
    }
    if (visual === 'control') indicators.forEach((light, i) => {
      light.material = material(action === 'misuse' && i === 2 ? colors.terra : action === 'oversight' && i === 0 ? colors.gold : colors.mint);
      light.scale.setScalar(reduced ? 1 : .9 + .15 * Math.sin(t * 2 + i));
    });
    if (visual === 'writing' && moving[0]) {
      const paper = moving[0], partner = action === 'partner' || action === 'ideas';
      const exchange = reduced ? 0 : partner ? ease((t - 23.06) / .7) : 0;
      paper.position.x = reduced ? -.72 : action === 'ideas' ? 1.55 + .12 * Math.sin(t * 1.2) : -.95 + 2.5 * exchange;
      paper.position.z = partner ? .42 : .22;
      paper.rotation.z = reduced ? 0 : partner ? .06 * Math.sin(t) : 0;
    }
    if (visual === 'tasks' && moving.length) moving.forEach((task, i) => {
      const progress = reduced ? 0 : Math.max(0, Math.min(1, (t - 21.96) / (27.16 - 21.96)));
      const stagger = Math.max(0, Math.min(1, progress * 3 - i));
      task.position.x = -.95 + i * .72 + (action === 'tedious' ? 3.1 * stagger : 0);
      task.position.y = .76 + (action === 'tedious' ? .08 * Math.sin(t * 4 + i) : 0);
    });
    if (visual === 'work' && moving.length) moving.forEach((task, i) => {
      task.position.x = -.95 + i * .72;
      task.position.y = .76 + (action === 'human-work' && !reduced ? .08 * Math.sin(t * 3 + i) : 0);
    });
    if (visual === 'creativity') moving.forEach((block, i) => {
      const progress = action === 'create' ? (reduced ? 0 : Math.max(0, Math.min(1, (t - 15.3) / 1.6))) : 0;
      block.position.x = -1.65 + i * 1.55 + (i === 2 ? 1.35 * (1 - progress) : 0);
      block.position.y = .37 + (progress * (i + 1) * .22);
      block.rotation.y = reduced ? 0 : .12 * Math.sin(t * 1.5 + i) * progress;
    });
    if (visual === 'isolation' && moving.length) moving.forEach((barrier, i) => {
      const together = action === 'together';
      const apart = action === 'apart';
      const sign = i - 1;
      const joining = together ? ease((t - 6.8) / .52) : 0;
      barrier.position.x = -1.15 + i * 1.15 + (reduced ? 0 : together ? sign * 1.25 * joining : apart ? sign * .18 : 0);
      barrier.position.y = i === 1 && !reduced ? .95 - .85 * joining : 0;
      barrier.rotation.z = reduced ? 0 : together ? sign * .42 * joining : 0;
    });
    if (visual === 'environment') {
      smoke.forEach((cloud, i) => { cloud.position.y = 1.75 + i * .2 + (reduced ? 0 : .08 * Math.sin(t * 1.4 + i)); });
      foliage.forEach(leaf => leaf.scale.setScalar(action === 'impact' ? .68 : .9));
    }
    if (visual === 'nature') {
      const growth = reduced ? 0 : Math.max(0, Math.min(1, (t - 12.48) / (16.8 - 12.48)));
      foliage.forEach(leaf => leaf.scale.setScalar(.68 + .32 * growth));
    }
    if (visual === 'balance') {
      const beam = g.children.find(child => child.type === 'Mesh' && child.geometry.type === 'CylinderGeometry' && Math.abs(child.position.x) < .01 && Math.abs(child.position.y - .32) < .01);
      if (beam) beam.rotation.z = reduced ? 0 : .06 * Math.sin(t * .7);
    }
    if (visual === 'independence' || visual === 'path' || visual === 'support') {
      const walk = action === 'future' || action === 'independence';
      const progress = reduced || !walk ? 0 : Math.max(0, Math.min(1, (t - 10.16) / (12.58 - 10.16)));
      moving.forEach((step, i) => {
        step.position.y = .12 + i * .17 + (reduced ? 0 : .035 * Math.sin(t * 3 + i));
      });
      g.userData.pathProgress = progress;
    }
  };
  return g;
}

export function createSemanticStage(data, sceneIndex, scene) {
  const root = new T.Group();
  const platform = box(root, 0, -.14, 0, 8.8, .28, 4.7, colors.ground);
  platform.receiveShadow = true;
  box(root, 0, -.28, 0, 8.65, .035, 4.55, colors.gold);
  const config = scene;
  const speaker = person(root, -2.05, -1.25, 2.15, colors.terra, '');
  const secondName = config.people[1];
  const secondIsAI = /AI/i.test(secondName);
  const other = secondIsAI ? null : person(root, .45, -1.15, /son|daughter|children|teen/i.test(secondName) ? 1.55 : 1.9, colors.blue, '');
  const third = config.people[2] ? person(root, 1.72, -.9, 1.7, colors.mint, '') : null;
  const ai = aiTerminal(root);
  const prop = createProp(root, config.visual);
  const sceneStart = data.scenes[sceneIndex].start;
  return {
    root, speaker, other, third, ai, prop,
    update(moment, seconds, reduced) {
      const t = reduced ? sceneStart : Math.max(0, seconds);
      speaker.group.position.x = -2.05;
      speaker.group.scale.setScalar(1);
      if (other) other.group.position.x = .45;
      const pulse = reduced ? 0 : .018 * Math.sin(t * 1.8);
      speaker.group.position.y = pulse;
      if (other) other.group.position.y = -pulse * .7;
      if (third) third.group.position.y = pulse * .5;
      ai.position.y = reduced ? 0 : .012 * Math.sin(t * 1.2);
      const speaking = moment?.status === 'question' || moment?.status === 'uncertain';
      speaker.arms[0].rotation.z = reduced ? 0 : (speaking ? -.12 : -.025) * Math.sin(t * 1.1);
      speaker.arms[1].rotation.z = reduced ? 0 : (speaking ? .12 : .025) * Math.sin(t * 1.1);
      if (other) other.arms[0].rotation.z = reduced ? 0 : .035 * Math.sin(t * 1.1 + 1);
      if (config.visual === 'writing') {
        const leaving = moment?.action === 'replace' ? ease((t - 18.76) / .65) : 0;
        const returning = moment?.action === 'partner' || moment?.action === 'ideas' ? 1 - ease((t - 23.06) / .65) : 0;
        const aside = reduced ? 0 : Math.max(leaving, returning);
        speaker.group.position.x = -2.05 - aside;
        speaker.group.scale.setScalar(1 - .1 * aside);
      }
      if (other && (config.visual === 'path' || config.visual === 'independence')) {
        const progress = reduced ? 0 : Math.max(0, Math.min(1, (t - 10.16) / (12.58 - 10.16)));
        other.group.position.x = .45 + (moment?.action === 'future' || moment?.action === 'independence' ? 1.6 * progress : 0);
        if (!reduced && progress > 0) other.group.position.y += .035 * Math.abs(Math.sin(t * 4));
      }
      if (other && config.visual === 'thinking') {
        const learning = moment?.action === 'learning';
        other.group.position.x = reduced ? .45 : .45 + (learning ? -.5 : 0);
        other.arms[0].rotation.z = reduced ? 0 : learning ? -.32 * (.6 + .4 * Math.sin(t * 2)) : .035 * Math.sin(t);
      }
      if (config.visual === 'creativity' && other && moment?.action === 'create' && !reduced) {
        other.arms[0].rotation.z = -.3 * (.6 + .4 * Math.sin(t * 2));
      }
      if (other && (config.visual === 'isolation' || config.visual === 'empathy' || config.visual === 'connection')) {
        const together = moment?.action === 'together';
        if (!reduced && together) {
          const joining = config.visual === 'isolation' ? ease((t - 6.8) / .52) : ease((t - sceneStart) / .7);
          speaker.group.position.x = -2.05 + .7 * joining;
          other.group.position.x = .45 - .7 * joining;
          other.arms[0].rotation.z = -.16;
        }
      }
      prop.userData.semanticUpdate?.(moment?.action, t, reduced);
    }
  };
}
