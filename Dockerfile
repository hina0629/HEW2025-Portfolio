FROM node:20-alpine

# 作業ディレクトリの設定
WORKDIR /app

# Viteのデフォルトポートである5173を公開
EXPOSE 5173

# 起動時のデフォルトコマンド（compose.yml側で上書きされます）
CMD ["npm", "run", "dev", "--", "--host"]
