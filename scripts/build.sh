echo "node $(node -v)"
echo "npm $(npm -v)"
echo "yarn $(yarn -v)"

# copy
cp index.d.ts es/index.d.ts

# build es
npx babel src --out-dir es --ignore "src/**/*.test.js" --source-maps

# copy module
# 'use strict' mode can't exec eval in kity package (create class)
cp -r src/module/ es/module
cp -r src/class/ es/class

# complie css
npx lessc --js --silent --npm-import="prefix=~" src/less/index.less dist/css/index.css
npx lessc --js --silent --npm-import="prefix=~" src/less/vender.less dist/css/vender.css
