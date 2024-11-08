import os
import sys
import json

def main():
    if len(sys.argv) < 2:
        print("No data provided.")
        return

    try:
        payload = json.loads(sys.argv[1])
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

        data = {"vision":vision,"content":content,"time":time}
        data_list.insert(0, data)

        with open(file, 'w', encoding='utf-8') as f:
            json.dump(data_list, f, ensure_ascii=False, indent=4)

        print(f"Data appended to {file} successfully.")

    except json.JSONDecodeError:
        print("Failed to decode JSON.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
