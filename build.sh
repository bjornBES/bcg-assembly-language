
OutputPath="./Builds/ACL-$1/ACL-$1.vsix"
mkdir ./Builds/ACL-$1

vsce pack -o $OutputPath
