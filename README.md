install.packages("readr")
<!-- install.packages("dplyr") -->
check - install.packages("openxlsx")
install.packages("tidyverse")
install.packages("httr")


ERROR: dependencies ‘curl’, ‘openssl’ are not available for package ‘httr’
* removing ‘/usr/local/lib/R/site-library/httr’
ERROR: dependency ‘httr’ is not available for package ‘rvest’
* removing ‘/usr/local/lib/R/site-library/rvest’
ERROR: dependencies ‘httr’, ‘rvest’ are not available for package ‘tidyverse’
* removing ‘/usr/local/lib/R/site-library/tidyverse’
install.packages('httr')
sudo apt-get install httr 

install.packages(c("readr", "openxlsx","tidyverse"))

sudo -i R --vanilla

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
- https://github.com/abraunegg/onedrive/blob/master/docs/INSTALL.md
- If you want to sync your files automatically, enable and start the systemd service:
  - `systemctl --user enable onedrive`
  - `systemctl --user start onedrive`
- install R
- `sudo apt-get install libxml2-dev libssl-dev libcurl4-openssl-dev`

- run the r script once as sudo so it can install all the packages
- if the install hangs it could be this https://stackoverflow.com/a/40949665


```
npm install -g pm2
pm2 start app.js --name="fetch-gecko_3024" --interpreter=/home/ubuntu/.nvm/versions/node/v12.16.1/bin/node
```

**Selective sync** - Selective sync allows you to sync only specific files and directories. To enable selective sync create a file named `sync_list` in `~/.config/onedrive`. Each line of the file represents a relative path from your `sync_dir`. All files and directories not matching any line of the file will be skipped during all operations. Here is an example of `sync_list`:
```
apps-sync
```