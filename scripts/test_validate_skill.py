"""Exercise navigation failures in isolated repositories, including ignored artifacts."""
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


class NavigationValidation(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        (self.root / 'scripts').mkdir()
        shutil.copyfile(Path(__file__).with_name('validate_skill.py'), self.root / 'scripts/validate_skill.py')
        self.refs = self.root / '.agents/skills/dsh-plugin-development/references'
        self.refs.mkdir(parents=True)
        (self.refs / 'source-map.md').write_text('# Evidence\n')
        (self.root / '.gitignore').write_text('/tmp/\n')
        (self.root / 'tmp').mkdir()
        (self.root / 'tmp/ignored.md').write_text('[broken](missing.md)\n```json\ninvalid\n```\n')

    def run_check(self):
        return subprocess.run(['python3', 'scripts/validate_skill.py'], cwd=self.root,
                              capture_output=True, text=True)

    def test_unicode_duplicate_headings_and_cross_file_links(self):
        (self.refs / 'topic.md').write_text('# 接口\n## 清理\n## 清理\n[重复](#清理-1)\n')
        (self.root / 'README.md').write_text('[入口](.agents/skills/dsh-plugin-development/references/topic.md#%E6%B8%85%E7%90%86)\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_same_file_anchor(self):
        (self.refs / 'topic.md').write_text('# 接口\n[错误](#不存在)\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing anchor', result.stdout)

    def test_missing_cross_file_anchor_after_rename(self):
        (self.refs / 'topic.md').write_text('# 新标题\n')
        (self.root / 'README.md').write_text('[旧入口](.agents/skills/dsh-plugin-development/references/topic.md#旧标题)\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing anchor', result.stdout)

    def test_invalid_json_fails(self):
        (self.refs / 'topic.md').write_text('# 示例\n```json\n{"broken":}\n```\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('JSON', result.stdout)


if __name__ == '__main__':
    unittest.main()
