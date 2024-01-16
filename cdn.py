import os

def print_absolute_paths(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.abspath(os.path.join(root, file))
            print(file_path.replace(
                'G:\\Develop\\gazetrack\\dist\\assets', 'https://pages.lgyserver.top/gaze/assets').replace('\\', '/')
            )

# 替换为你要遍历的目录路径
directory_to_traverse = 'G:\\Develop\\gazetrack\\dist\\assets'

print_absolute_paths(directory_to_traverse)