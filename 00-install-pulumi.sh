#!/usr/bin/env -S bash


set -xueo pipefail

curl -fsSL https://get.pulumi.com | sh

ln -sf ~/.pulumi/bin/pulumi ~/bin/

pulumi version
pulumi login -l


echo was created with pulumi new typescript
