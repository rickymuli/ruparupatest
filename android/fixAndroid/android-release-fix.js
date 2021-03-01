const fs = require('fs')

try {
  var curDir = __dirname
  var rootDir = process.cwd()

  var file = `${rootDir}/node_modules/react-native/react.gradle`
  var dataFix = fs.readFileSync(`${curDir}/android-react-gradle`, 'utf8')

  fs.writeFileSync(file, dataFix, 'utf8')
  console.log('Android Gradle Fixed!')
} catch (error) {
  console.error(error)
}
