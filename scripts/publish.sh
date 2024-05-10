OUTPUT_DIR=dist

npm run build &> /dev/null && echo ">> build success!"

cp src/package-publish.json $OUTPUT_DIR/package.json

cd src

old_version=$(npm view react-minder-craft@latest version)

echo ">> old version: ${old_version}"

current_version=$(cat package.json | grep -o "\"version\": \"[^\"]*\"" | cut -d '"' -f 4)

echo ">> current version: ${current_version}"

if [[ $old_version == $current_version ]]; then
    new_version=$(npm version --no-git-tag-version patch)
    echo ">> set new version: ${new_version}"
fi

cd ../$OUTPUT_DIR

npm publish