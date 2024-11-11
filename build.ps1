$PackageVersion = $args[0]

$OutputPath = "./Builds/ACL-$($PackageVersion)/ACL-$($PackageVersion).vsix"
mkdir ./Builds/ACL-$PackageVersion

vsce pack -o $OutputPath