

- Ubuntu 18.04
- associate an ElasticIP
- point a subdomain at it https://freedns.afraid.org/subdomain/
- install NVM https://github.com/nvm-sh/nvm#install-script
- `sudo apt-get update`
- `sudo apt-get install nginx`
- `cd fetch-gecko`
- `nvm use`
- `npm install`
- https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx
- `sudo apt-get install onedrive`(https://packages.ubuntu.com/bionic/onedrive)

```
npm install -g pm2
pm2 start app.js --name="fetch-gecko_3020" --interpreter=/home/ubuntu/.nvm/versions/node/v12.16.1/bin/node
```

https://github.com/skilion/onedrive

**Selective sync** - Selective sync allows you to sync only specific files and directories. To enable selective sync create a file named `sync_list` in `~/.config/onedrive`. Each line of the file represents a relative path from your `sync_dir`. All files and directories not matching any line of the file will be skipped during all operations. Here is an example of `sync_list`:
```
apps-sync
```