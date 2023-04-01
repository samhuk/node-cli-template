/**
 * This script performs various tasks that setup the template.
 *
 * It replaces instances of placeholder words, runs `npm i`, etc.
 *
 * To run this script, run `node setup.js` from the package template root directory.
 */

const { exec } = require('child_process')
const fs = require('fs')
const readline = require('readline')

const r1 = readline.createInterface({ input: process.stdin, output: process.stdout })

const VALIDATORS = {
  isNonEmptyString: { op: s => s != null && s.length > 0, errMsg: 'Cannot be empty' },
  hasNoSpaces: { op: s => s.indexOf(' ') === -1, errMsg: 'Cannot have whitespace' },
}

const tryGetInput = (question, onComplete, validators, defaultIfEmpty) => {
  const _question = defaultIfEmpty != null ? `${question} [${defaultIfEmpty}]: ` : `${question}: `
  r1.question(_question, name => {
    const isEmpty = !VALIDATORS.isNonEmptyString.op(name)
    if (isEmpty && defaultIfEmpty != null) {
      onComplete(defaultIfEmpty)
    }
    else if (validators != null) {
      const errMsgList = validators.reduce((acc, validator) => (validator.op(name) ? acc : acc.concat(validator.errorMsg)), [])
      if (errMsgList.length === 0) {
        onComplete(name)
      }
      else {
        console.log('Error:', errMsgList.join(', '))
        tryGetInput(question, onComplete, validators, defaultIfEmpty)
      }
    }
    else {
      onComplete(name)
    }
  })
}

const getDashCaseAppName = () => new Promise((res, rej) => {
  tryGetInput('app-name', res, [VALIDATORS.hasNoSpaces], 'node-cli-app')
})

const getNpmPackageName = () => new Promise((res, rej) => {
  tryGetInput('npm-package-name', res, [VALIDATORS.hasNoSpaces], 'node-cli-app')
})

const getLicenseName = () => new Promise((res, rej) => {
  tryGetInput('license-name', res, [], 'Joe Bloggs')
})

const getLicenseEmail = () => new Promise((res, rej) => {
  tryGetInput('license-email', res, [VALIDATORS.hasNoSpaces], 'joebloggs@email.com')
})

const getGithubUserName = () => new Promise((res, rej) => {
  tryGetInput('github-user-name', res, [VALIDATORS.hasNoSpaces], 'joebloggs')
})

const getAppSlogan = () => new Promise((res, rej) => {
  tryGetInput('app-slogan', res, [], 'Node.js CLI Application')
})

const _replaceTokensInFiles = (filePaths, tokenMapEntries, i, onComplete) => {
  if (i >= filePaths.length) {
    onComplete()
    return
  }

  const filePath = filePaths[i]

  console.log(`--> ${filePath}`)

  const fileText = fs.readFileSync(filePath, 'utf8')
  let newFileText = fileText
  tokenMapEntries.forEach(tokenMapEntry => {
    newFileText = newFileText.replace(new RegExp(tokenMapEntry[0], 'g'), tokenMapEntry[1])
  })
  fs.writeFileSync(filePath, newFileText)

  _replaceTokensInFiles(filePaths, tokenMapEntries, i + 1, onComplete)
}

const replaceTokensInFiles = (filePaths, tokenMap) => new Promise((res, rej) => {
  console.log('\n==> Replacing some placeholder words in files...')
  const tokenMapEntries = Object.entries(tokenMap)
  _replaceTokensInFiles(filePaths, tokenMapEntries, 0, res)
})

const npmInstall = () => new Promise((res, rej) => {
  console.log('==> Installing npm dependencies...')
  exec('npm i', err => {
    if (err != null)
      console.log(err)
    else
      res()
  })
})

const main = async () => {
  const dashCaseAppName = await getDashCaseAppName()
  const npmPackageName = await getNpmPackageName()
  const licenseName = await getLicenseName()
  const licenseEmail = await getLicenseEmail()
  const githubUserName = await getGithubUserName()
  const appSlogan = await getAppSlogan()

  const tokenMap = {
    '{{app-name}}': dashCaseAppName,
    '{{npm-package-name}}': npmPackageName,
    '{{license-name}}': licenseName,
    '{{license-email}}': licenseEmail,
    '{{github-user-name}}': githubUserName,
    '{{app-slogan}}': appSlogan,
  }

  await replaceTokensInFiles(['./README.md', './package.json', './LICENSE', './src/common/name.ts'], tokenMap)

  await npmInstall()

  console.log('\nSetup complete! Run: npm run build-dev && npm run hello-dev "Joe Bloggs"')
  r1.close()
}

main()
