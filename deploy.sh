git pull origin master
npm install
npm run build
pm2 reload RealEstateFrontEnd
systemctl restart nginx