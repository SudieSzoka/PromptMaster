document.addEventListener('DOMContentLoaded', () => {
    const fileListContainer = document.getElementById('file-list');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalCode = document.getElementById('modal-code');

    // 获取所有JSON文件
    fetch('scripts/datalist.json')
    .then(response => response.json())
    .then(jsonFiles => {
        // 获取文件列表后加载每个文件
        jsonFiles.forEach(file => {
            fetch(`data/${file}`)
                .then(response => response.json())
                .then(data => {
                    createFileItem(file, data);
                })
                .catch(error => console.error(`Error loading ${file}:`, error));
        });

        // 创建快速导航
        // 在获取JSON文件后，创建快速导航
        const quickNav = document.getElementById('quick-nav');
        jsonFiles.forEach(file => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.textContent = file.replace('.json', '');
            
            navItem.addEventListener('click', () => {
                const allFileItems = document.querySelectorAll('.file-item');
                const targetFile = document.querySelector(`.file-title span[data-filename="${file}"]`);
                
                if (targetFile) {
                    // 获取目标文件的内容区域和图标
                    const targetContent = targetFile.closest('.file-item').querySelector('.content-section');
                    const targetIcon = targetFile.closest('.file-title').querySelector('i');
                    const isTargetCollapsed = targetContent.style.display === 'none';
                    
                    // 折叠所有项目
                    allFileItems.forEach(item => {
                        const content = item.querySelector('.content-section');
                        const icon = item.querySelector('.file-title i');
                        content.style.display = 'none';
                        icon.className = 'fas fa-chevron-right';
                    });
                    
                    // 如果目标是折叠的，则展开它
                    if (isTargetCollapsed) {
                        targetContent.style.display = 'block';
                        targetIcon.className = 'fas fa-chevron-down';
                    }
                    
                    // 滚动到目标位置
                    targetFile.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            quickNav.appendChild(navItem);
        });
    })
    .catch(error => console.error('Error loading datalist.json:', error));

    // jsonFiles.forEach(file => {
    //     fetch(`data/${file}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             createFileItem(file, data);
    //         })
    //         .catch(error => console.error(`Error loading ${file}:`, error));
    // });

    function createFileItem(fileName, data) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
    
        const header = document.createElement('div');
        header.className = 'file-header';
    
        const title = document.createElement('div');
        title.className = 'file-title';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-right';
        title.appendChild(icon);
        
        const titleText = document.createElement('span');
        titleText.textContent = fileName.replace('.json', '');
        titleText.setAttribute('data-filename', fileName); // 添加标识符
        title.appendChild(titleText);
        
        // 创建控制栏容器
        const controlBar = document.createElement('div');
        controlBar.className = 'control-bar';
        
        // 修改版本选择下拉框
        const versionSelect = document.createElement('select');
        versionSelect.className = 'version-select';
        data.forEach((version, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${version.vision}`;
            versionSelect.appendChild(option);
        });
        
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'time-display';
        
        versionSelect.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            timeDisplay.textContent = data[selectedIndex].time;
            displayContent(contentSection, data[selectedIndex].content);
        });
        
        // 将控制元素添加到控制栏
        controlBar.appendChild(versionSelect);
        controlBar.appendChild(timeDisplay);
        
        header.appendChild(title);
        header.appendChild(controlBar);
        
        // 设置初始时间和状态
        const contentSection = document.createElement('div');
        contentSection.className = 'content-section';
        // 默认隐藏内容
        contentSection.style.display = 'none';
        
        // 修改折叠逻辑
        title.addEventListener('click', () => {
            const isActive = contentSection.style.display === 'block';
            if (isActive) {
                contentSection.style.display = 'none';
                icon.className = 'fas fa-chevron-right';
            } else {
                contentSection.style.display = 'block';
                icon.className = 'fas fa-chevron-down';
            }
        });
    
        fileItem.appendChild(header);
        fileItem.appendChild(contentSection);
        fileListContainer.appendChild(fileItem);
        
        // 设置初始内容
        versionSelect.selectedIndex = 0;
        displayContent(contentSection, data[0].content);
        timeDisplay.textContent = data[0].time;
        
        // 如果是第一个文件，默认展开
        if (fileListContainer.children.length === 1) {
            contentSection.style.display = 'block';
            icon.className = 'fas fa-chevron-down';
        }
    }
    
    
    function displayContent(container, content) {
        container.innerHTML = '';
        
        const contentHeader = document.createElement('div');
        contentHeader.className = 'content-header';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
        
        contentHeader.appendChild(copyButton);
        container.appendChild(contentHeader);
        
        const codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = content.replace(/\\n/g, '\n');
        pre.appendChild(code);
        
        codeBlock.appendChild(pre);
        container.appendChild(codeBlock);
        
        copyButton.addEventListener('click', () => {
            copyToClipboard(content);
            showCopyNotification(copyButton);
        });
    }
    
    // 添加新函数：显示复制成功提示
    function showCopyNotification(button) {
        const notification = document.createElement('span');
        notification.className = 'copy-notification';
        notification.textContent = '已复制';
        button.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // 成功
        }, () => {
            // 失败
        });
    }

    // 关闭模态框
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});