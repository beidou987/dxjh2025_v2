#!/bin/bash

# 05级高药2班 · 廿载重逢 H5邀请函打包脚本

echo "开始打包邀请函项目..."

# 创建打包时间戳
TIME_STAMP=$(date +"%Y%m%d%H%M")

# 打包文件名
PACKAGE_NAME="classmate_h5_invitation_${TIME_STAMP}.zip"

# 检查是否有zip命令
if ! command -v zip &> /dev/null; then
    echo "错误: 未找到zip命令。请安装zip后再试。"
    exit 1
fi

# 创建zip文件，排除不必要的文件
zip -r "${PACKAGE_NAME}" \
    index.html \
    css/ \
    js/ \
    images/ \
    music/ \
    README.md \
    USER_GUIDE.md \
    -x "*.DS_Store" \
    -x "**/.DS_Store" \
    -x "**/placeholder.txt" \
    -x "package.sh" \
    -x ".git/*" \
    -x ".gitignore"

# 检查打包是否成功
if [ $? -eq 0 ]; then
    echo "打包成功！文件名: ${PACKAGE_NAME}"
    echo "文件大小: $(du -h "${PACKAGE_NAME}" | cut -f1)"
    echo ""
    echo "您可以将此文件分享给同学们，或上传到网站进行托管。"
else
    echo "打包失败，请检查错误信息。"
fi 