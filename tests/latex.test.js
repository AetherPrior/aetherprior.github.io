const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'web_cv.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'js/latex.js'), 'utf8');

function browser() {
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    dom.window.eval(script); // A browser has no CommonJS module global.
    return dom.window;
}

test('browser export includes each CV entry once and preserves content', () => {
    const w = browser();
    assert.equal(w.document.querySelectorAll('#experience > .entry').length, 5);
    assert.equal(w.document.querySelectorAll('#experience .entry .entry').length, 0);
    const tex = w.generateLatex();
    assert.equal((tex.match(/Research Intern, Autonomous Systems/g) || []).length, 1);
    for (const content of ['An Emergent Mirage', 'Secure and Correct Code Generation',
        'February 2026', 'yzchen@umd.edu', 'co-presented with Akhila Yerukola']) {
        assert.ok(tex.includes(content), content);
    }
    assert.ok(!tex.includes('Multilingual Federated Learning'));
    assert.ok(!tex.includes('Sunayana'));
});

test('special characters are escaped once, with valid commands and links', () => {
    const w = browser();
    assert.equal(w.escapeLatex('50% $250,000 a_b & {x} \\ ~'),
        '50\\% \\$250,000 a\\_b \\& \\{x\\} \\textbackslash{} $\\sim$');
    const node = w.document.createElement('div');
    node.innerHTML = '<b>Linked title</b> <a href="https://example.com/a_b?x=1&amp;y=2">[↗]</a>';
    assert.equal(w.processElementForLatex(node),
        '\\href{https://example.com/a\\_b?x=1\\&y=2}{\\textbf{Linked title}}');
});

test('CLI reads web_cv.html and matches browser output from another directory', () => {
    const os = require('node:os');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-export-'));
    try {
        const output = path.join(tmp, 'cv.tex');
        execFileSync(process.execPath, [path.join(root, 'export_to_latex.js'), output], { cwd: tmp });
        assert.equal(fs.readFileSync(output, 'utf8'), browser().generateLatex());
    } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
    }
});
