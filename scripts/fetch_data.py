import os
import sys
import json

def main():
    try:
        payload = json.load(sys.stdin)
        # 确保 users 是列表格式
        name = payload.get("name")
        content = payload.get("content")
        vision = payload.get("vision")
        time = payload.get("time")

        data_dir = 'data'
        os.makedirs(data_dir, exist_ok=True)
            
        file = os.path.join(data_dir, f"{name}.json")

        if os.path.exists(file):
            with open(file, 'r', encoding='utf-8') as f:
                data_list = json.load(f)
        else:
            data_list = []

        # 检查是否存在相同 vision
        for item in data_list:
            if item.get("vision") == vision:
                item["content"] = content
                item["time"] = time
                break
        else:
            data = {"vision": vision, "content": content, "time": time}
            data_list.insert(0, data)

        with open(file, 'w', encoding='utf-8') as f:
            json.dump(data_list, f, ensure_ascii=False, indent=4)

        print(f"Data appended to {file} successfully.")

    except json.JSONDecodeError:
        print("Failed to decode JSON.")
    except Exception as e:
        print(f"An error occurred: {e}")
    # 遍历data目录下的所有json文件，写入到datalist.json中
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
    datalist_path = os.path.join(script_dir, 'datalist.json')
    with open(datalist_path, 'w', encoding='utf-8') as f:
        json.dump(json_files, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
