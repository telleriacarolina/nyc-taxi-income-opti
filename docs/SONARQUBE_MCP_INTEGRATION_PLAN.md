# SonarQube MCP Server Integration Plan

## Overview
Integrate SonarQube MCP Server to enable seamless code quality and security analysis within the development workflow. The MCP server provides real-time code analysis, vulnerability detection, and quality metrics directly in the agent context.

## Objectives
- Enable automated code quality checks
- Integrate security vulnerability scanning
- Provide real-time code analysis feedback
- Support both SonarQube Server and SonarQube Cloud
- Enable code snippet analysis within agent context

## Prerequisites

### 1. SonarQube Access
- [ ] SonarQube Server URL or Cloud organization
- [ ] Authentication token (user token or project token)
- [ ] Project key for the NYC TAXI Income Optimizer
- [ ] Required permissions: Execute Analysis, Browse

### 2. Development Environment
- [ ] Node.js 18+ (already available)
- [ ] npm or npx (already available)
- [ ] MCP server installation capability

### 3. Project Requirements
- [ ] Define code quality gates
- [ ] Establish security hotspot thresholds
- [ ] Configure language-specific rules (TypeScript, JavaScript, CSS)

## Implementation Phases

### Phase 1: Installation & Configuration (Week 1)

#### Step 1.1: Install SonarQube MCP Server
```bash
# Option A: Global installation
npm install -g @sonarqube/mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for easy access
npm link

# Return to project directory
cd /workspaces/spark-template

# Link the MCP server to the project
npm link sonarqube-mcp-server

# Install SonarQube Scanner
npm install --save-dev sonarqube-scanner
```

#### Step 1.2: Create SonarQube Configuration
**File:** `sonar-project.properties`
```properties
# Project identification
sonar.projectKey=nyc-taxi-income-optimizer
sonar.projectName=NYC TAXI Income Optimizer
sonar.projectVersion=1.0.0

# Source code location
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx

# Exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.config.js,**/*.config.ts

# TypeScript/JavaScript settings
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPath=tsconfig.json

# Code coverage
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/*.d.ts

# Language
sonar.language=ts
```

#### Step 1.3: Configure MCP Server
**File:** `.mcp/sonarqube-config.json`
```json
{
  "serverUrl": "${SONARQUBE_URL}",
  "token": "${SONARQUBE_TOKEN}",
  "projectKey": "nyc-taxi-income-optimizer",
  "organization": "${SONARQUBE_ORG}",
  "qualityGate": {
    "waitForAnalysis": true,
    "timeout": 300
  },
  "rules": {
    "typescript": ["typescript:S1481", "typescript:S1854", "typescript:S3776"],
    "security": ["typescript:S5122", "typescript:S4817", "typescript:S2068"]
  }
}
```

#### Step 1.4: Environment Variables
**File:** `.env.local` (add to .gitignore)
```bash
# SonarQube Configuration
SONARQUBE_URL=https://sonarcloud.io or https://your-sonarqube-server.com
SONARQUBE_TOKEN=your-authentication-token-here
SONARQUBE_ORG=your-organization-key
SONARQUBE_PROJECT_KEY=nyc-taxi-income-optimizer
```

### Phase 2: Integration with Dev Workflow (Week 1-2)

#### Step 2.1: Add NPM Scripts
**File:** `package.json` (add to scripts section)
```json
{
  "scripts": {
    "sonar:scan": "sonar-scanner",
    "sonar:analyze": "npm run build && npm run sonar:scan",
    "sonar:check": "sonarqube-mcp check --project nyc-taxi-income-optimizer",
    "sonar:snippet": "sonarqube-mcp analyze-snippet",
    "sonar:report": "sonarqube-mcp generate-report"
  }
}
```

#### Step 2.2: Pre-commit Hook Integration
**File:** `.husky/pre-commit` (if using Husky)
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run SonarQube quick check on staged files
npm run sonar:check
```

#### Step 2.3: VS Code Task Configuration
**File:** `.vscode/tasks.json` (add to existing tasks)
```json
{
  "label": "SonarQube: Analyze Current File",
  "type": "shell",
  "command": "npm run sonar:snippet -- ${file}",
  "group": "test",
  "presentation": {
    "reveal": "always",
    "panel": "new"
  }
}
```

### Phase 3: CI/CD Integration (Week 2)

#### Step 3.1: GitHub Actions Workflow
**File:** `.github/workflows/sonarqube.yml`
```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  sonarqube:
    name: Code Quality & Security Analysis
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: SonarQube Scan
        uses: sonarsource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          args: >
            -Dsonar.projectKey=nyc-taxi-income-optimizer
            -Dsonar.organization=${{ secrets.SONAR_ORGANIZATION }}
      
      - name: Quality Gate Check
        run: npm run sonar:check
```

#### Step 3.2: Quality Gate Configuration
Define quality gates in SonarQube:
- **Reliability:** 0 bugs on new code
- **Security:** 0 vulnerabilities on new code
- **Maintainability:** Technical debt ratio < 5%
- **Coverage:** > 80% on new code
- **Duplications:** < 3% on new code
- **Security Hotspots:** 100% reviewed

### Phase 4: MCP Server Features (Week 2-3)

#### Feature 4.1: Real-time Code Analysis
Configure MCP to analyze code as you type:
```typescript
// Agent can query: "Analyze this component for issues"
// MCP responds with issues, vulnerabilities, code smells
```

#### Feature 4.2: Security Hotspot Detection
```typescript
// Agent can query: "Check for security issues in authentication"
// MCP scans authentication-related files and reports findings
```

#### Feature 4.3: Code Quality Metrics
```typescript
// Agent can query: "Show code quality metrics for src/components/"
// MCP returns complexity, maintainability, duplication metrics
```

#### Feature 4.4: Snippet Analysis
```typescript
// Agent can analyze code snippets without full project context
// Useful for quick checks during development
```

### Phase 5: Documentation & Training (Week 3)

#### Documentation Files to Create:
1. **docs/SONARQUBE_SETUP.md** - Installation and configuration guide
2. **docs/CODE_QUALITY_STANDARDS.md** - Quality standards and best practices
3. **docs/SECURITY_GUIDELINES.md** - Security scanning and hotspot resolution
4. **README.md** - Update with SonarQube badges and links

#### Training Materials:
- Developer guide for interpreting SonarQube reports
- Security vulnerability remediation procedures
- Code smell identification and refactoring guide
- Quality gate compliance checklist

## Configuration by Environment

### Local Development
```json
{
  "mode": "snippet",
  "autoAnalyze": true,
  "showInlineIssues": true,
  "notificationLevel": "warning"
}
```

### CI/CD Pipeline
```json
{
  "mode": "full",
  "autoAnalyze": true,
  "failOnQualityGate": true,
  "notificationLevel": "error"
}
```

### Production
```json
{
  "mode": "monitoring",
  "autoAnalyze": false,
  "generateReports": true,
  "notificationLevel": "info"
}
```

## Expected Benefits

### Code Quality Improvements
- Reduce technical debt by 40% in first 3 months
- Maintain < 5% code duplication across codebase
- Keep cyclomatic complexity under 15 for all functions

### Security Enhancements
- Zero critical vulnerabilities in production
- 100% security hotspot review rate
- Automated dependency vulnerability scanning

### Developer Experience
- Real-time feedback during development
- Clear remediation guidance for issues
- Integrated security awareness

### Project Metrics
- Code coverage > 80%
- Maintainability rating: A
- Reliability rating: A
- Security rating: A

## Success Metrics

### Week 1 Targets
- [ ] SonarQube MCP Server installed and configured
- [ ] First successful full project scan completed
- [ ] Quality gates defined and active

### Week 2 Targets
- [ ] CI/CD integration complete and passing
- [ ] All critical and blocker issues resolved
- [ ] Team trained on SonarQube usage

### Week 3 Targets
- [ ] Code quality baseline established
- [ ] Security scanning integrated into workflow
- [ ] Documentation complete and reviewed

## Risk Mitigation

### Risk 1: Token Security
**Mitigation:** Store tokens in environment variables, never commit to repository, use GitHub Secrets for CI/CD

### Risk 2: False Positives
**Mitigation:** Configure rule exclusions, customize quality profile for TypeScript/React, mark intentional exceptions

### Risk 3: Performance Impact
**Mitigation:** Run full scans in CI/CD only, use incremental analysis locally, optimize exclusion patterns

### Risk 4: Learning Curve
**Mitigation:** Provide comprehensive documentation, conduct team training sessions, establish code review practices

## Next Steps

### Immediate Actions (Next 24 hours)
1. **Create SonarQube project** in SonarQube Cloud or Server
2. **Generate authentication token** with appropriate permissions
3. **Install SonarQube MCP Server** in dev container
4. **Create initial configuration files** (sonar-project.properties, .mcp/sonarqube-config.json)

### Short-term Actions (This Week)
1. **Run first scan** and review baseline metrics
2. **Configure quality gates** based on project requirements
3. **Integrate with Git workflow** (pre-commit hooks)
4. **Add VS Code tasks** for quick analysis

### Medium-term Actions (Next 2 Weeks)
1. **Set up CI/CD integration** with GitHub Actions
2. **Resolve all blocker and critical issues** from initial scan
3. **Document quality standards** and security guidelines
4. **Train team** on SonarQube usage and best practices

## Resources

### Official Documentation
- SonarQube MCP Server: https://github.com/telleriacarolina/sonarqube-mcp-server
- SonarQube Documentation: https://docs.sonarqube.org/
- SonarCloud: https://sonarcloud.io/documentation
- Model Context Protocol: https://modelcontextprotocol.io/

### TypeScript/React Rules
- TypeScript Rules: https://rules.sonarsource.com/typescript
- React Best Practices: https://rules.sonarsource.com/javascript/tag/react

### Integration Guides
- GitHub Actions: https://github.com/SonarSource/sonarcloud-github-action
- VS Code Extension: https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode

## Appendix

### A. Common SonarQube Rules for TypeScript/React
- **S1481:** Unused local variables
- **S1854:** Dead store (unused assignments)
- **S3776:** Cognitive complexity too high
- **S5122:** CORS configuration security
- **S4817:** Insecure command execution
- **S2068:** Hard-coded credentials

### B. Quality Profile Customization
Create custom quality profile named "NYC-TAXI-TypeScript-React" with:
- All TypeScript default rules
- React-specific rules enabled
- Complexity threshold: 15
- Duplicate block size: 10 lines
- Issue severity customization based on project needs

### C. Exclusion Patterns
```properties
# Exclude generated files
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**

# Exclude configuration files
sonar.exclusions=**/*.config.js,**/*.config.ts,vite.config.ts,tailwind.config.js

# Exclude type definitions
sonar.exclusions=**/*.d.ts,**/types/**

# Exclude test files from production analysis
sonar.test.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
```

---

**Plan Created:** January 25, 2026  
**Status:** Ready for Implementation  
**Owner:** Development Team  
**Review Date:** Weekly during implementation
