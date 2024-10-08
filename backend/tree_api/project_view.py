from json import JSONEncoder
import os


class Entry:
    def __init__(self, is_dir=False, name="", path="/", files=[]):
        self.is_dir = is_dir
        self.name = name
        self.path = path
        self.files = files

    def __str__(self):
        if self.is_dir:
            return self.name + " [%s]" % (", ".join(map(str, self.files)))
        else:
            return self.name


# subclass JSONEncoder
class EntryEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


def list_dir(base_dir, directory):
    entries = os.listdir(directory)
    values = []
    for entry in entries:
        entry_path = os.path.join(directory, entry)
        rel_path = os.path.relpath(entry_path, base_dir)
        if os.path.isfile(entry_path):
            values.append(Entry(False, entry, rel_path))
        else:
            values.append(Entry(True, entry, rel_path, list_dir(base_dir, entry_path)))
    values.sort(key=lambda x: (not x.is_dir, x.name.lower()))
    return values
