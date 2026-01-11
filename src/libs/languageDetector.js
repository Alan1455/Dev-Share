import hljs from 'highlight.js';


class LanguageDetector {
  constructor() {
    this.lastDetected = 'text';
    this.rules = [
      {
        lang: 'python',
        patterns: [/:[\s\n]*$/, /^def\s+\w+\(/im, /^import\s+[\w\s,]+$/im, /elif\s+.*:/i, /print\s*\(.*\)/i, /self\./i, /^\s{4}\w/m],
        weight: 15
      },
      {
        lang: 'javascript',
        patterns: [/const\s+\w+\s*=/, /let\s+\w+\s*=/, /=>/, /\{[\s\n]*$/, /console\.log/i, /window\./i, /document\./i, /===/],
        weight: 12
      },
      {
        lang: 'typescript',
        patterns: [/: string/i, /: number/i, /interface\s+\w+/i, /type\s+\w+\s*=/i, /as\s+const/i, /<[A-Z]\w*>/],
        weight: 20
      },
      {
        lang: 'cpp',
        patterns: [/#include\s+<.*>/i, /std::\w+/i, /int\s+main\s*\(/i, /cout\s*<</i, /printf\s*\(.*\)/i],
        weight: 15
      },
      {
        lang: 'java',
        patterns: [/public\s+class\s+/i, /System\.out\.println/i, /static\s+void\s+main/i, /@Override/i],
        weight: 15
      },
      {
        lang: 'csharp',
        patterns: [/using\s+System/i, /Console\.WriteLine/i, /public\s+async\s+Task/i, /\w+\?\.\w+/],
        weight: 15
      },
      {
        lang: 'go',
        patterns: [/package\s+main/i, /func\s+\w+\(.*\)\s+\{/i, /fmt\.Println/i, /:=/],
        weight: 18
      },
      {
        lang: 'rust',
        patterns: [/fn\s+\w+\(.*\)\s*->/i, /let\s+mut\s+/i, /println!\(/i, /unwrap\(\)/i],
        weight: 20
      },
      {
        lang: 'sql',
        patterns: [/SELECT\s+.*\s+FROM/i, /INSERT\s+INTO/i, /UPDATE\s+.*\s+SET/i, /CREATE\s+TABLE/i, /WHERE\s+.*\s+=/i],
        weight: 15
      },
      {
        lang: 'html',
        patterns: [/<html/i, /<div/i, /<\/.*>/, /href=/i, /style=/i, /<script/i],
        weight: 12
      },
      {
        lang: 'css',
        patterns: [/^[\.\#]\w+\s*\{/im, /margin\s*:/i, /padding\s*:/i, /color\s*:/i, /display\s*:/i, /@media/i],
        weight: 12
      },
      {
        lang: 'markdown',
        patterns: [/^#\s+/m, /^##\s+/m, /\[.*\]\(.*\)/, /^\s*-\s+/m, /`{3,}/],
        weight: 10
      }
    ];
  }

  async detect(code) {
    if (!code || code.trim().length < 10) return this.lastDetected;

    let scores = {};
    this.rules.forEach(r => scores[r.lang] = 0);

    this.rules.forEach(rule => {
      rule.patterns.forEach(pattern => {
        if (pattern.test(code)) {
          scores[rule.lang] += rule.weight;
        }
      });
    });

    try {
      const subset = this.rules.map(r => r.lang);
      const autoRes = hljs.highlightAuto(code, subset);
      if (autoRes.language && scores[autoRes.language] !== undefined) {
        scores[autoRes.language] += 5;
      }
    } catch (ignored) {}

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [topLang, topScore] = sorted[0];

    console.log("[Detect Scores]:", scores);

    if (topScore > 0) {
        this.lastDetected = topLang;
    }

    return this.lastDetected;
  }
}

export const languageDetector = new LanguageDetector();

