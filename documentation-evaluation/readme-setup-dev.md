1:npm init
2:npm install --save-dev @types/jest @types/node jest ts-jest typescript parcel-bundler
3: create "jest.config.js"

module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

4: create index.html =    <script src="src/index.ts"></script>
5: create src folder
6: npx jest command for initiate testing
7: parcel index.html for launching the development server
8: in test_data folder a few csv files can be found for testing.