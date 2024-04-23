echo "node $(node -v)"
echo "npm $(npm -v)"
echo "yarn $(yarn -v)"

OUTPUT_DIR=dist

# copy
cp index.d.ts $OUTPUT_DIR/es/index.d.ts

# build es
npx babel src --out-dir $OUTPUT_DIR/es --ignore "src/**/*.test.js" --source-maps

# copy module
# 'use strict' mode can't exec eval in kity package (create class)
cp -r src/module/ $OUTPUT_DIR/es/module
cp -r src/class/ $OUTPUT_DIR/es/class

# complie css
npx lessc --js --silent --npm-import="prefix=~" src/less/index.less $OUTPUT_DIR/css/index.css
npx lessc --js --silent --npm-import="prefix=~" src/less/vender.less $OUTPUT_DIR/css/vender.css
