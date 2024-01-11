import os

def print_absolute_paths(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.abspath(os.path.join(root, file))
            print(file_path.replace(
                '/Users/dorapocket/Desktop/Develop/gazetrack/public', 'https://pages.lgyserver.top/public').replace('\\', '/')
            )

# 替换为你要遍历的目录路径
directory_to_traverse = '/Users/dorapocket/Desktop/Develop/gazetrack/public'

print_absolute_paths(directory_to_traverse)