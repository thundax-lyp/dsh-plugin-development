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
        self.refs = self.root / 'skills/dsh-plugin-development/references'
        self.refs.mkdir(parents=True)
        maintenance = self.refs.parent / 'maintenance'
        maintenance.mkdir()
        (maintenance / 'source-map.md').write_text('# Evidence\n')
        (self.root / '.gitignore').write_text('/tmp/\n')
        (self.root / 'tmp').mkdir()
        (self.root / 'tmp/ignored.md').write_text('[broken](missing.md)\n```json\ninvalid\n```\n')

    def run_check(self, *args):
        return subprocess.run(['python3', 'scripts/validate_skill.py', *args], cwd=self.root,
                              capture_output=True, text=True)

    def test_unicode_duplicate_headings_and_cross_file_links(self):
        (self.refs / 'topic.md').write_text('# 接口\n## 清理\n## 清理\n[重复](#清理-1)\n')
        (self.root / 'README.md').write_text('[入口](skills/dsh-plugin-development/references/topic.md#%E6%B8%85%E7%90%86)\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_same_file_anchor(self):
        (self.refs / 'topic.md').write_text('# 接口\n[错误](#不存在)\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing anchor', result.stdout)

    def test_missing_cross_file_anchor_after_rename(self):
        (self.refs / 'topic.md').write_text('# 新标题\n')
        (self.root / 'README.md').write_text('[旧入口](skills/dsh-plugin-development/references/topic.md#旧标题)\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing anchor', result.stdout)

    def test_offline_boundary_in_skill_source(self):
        (self.refs / 'topic.md').write_text('# Reference\nhttps://example.com\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('offline/local-path violation', result.stdout)

    def test_example_endpoint_is_not_an_external_reference(self):
        (self.refs / 'topic.md').write_text(
            '# Reference\n`https://example.invalid`\n```ts\nconst endpoint = "http://127.0.0.1:9"\n```\n'
        )
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_invalid_json_fails(self):
        (self.refs / 'topic.md').write_text('# 示例\n```json\n{"broken":}\n```\n')
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('JSON', result.stdout)

    def test_build_workspace_links_are_validated_by_the_build_verifier(self):
        source = self.root / '.dsh-skill-build/targets/v/skill-source/entrypoint'
        source.mkdir(parents=True)
        (source / 'SKILL.md').write_text('[output-relative](references/topic.md)\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_explicit_generated_skill_is_validated_without_formal_skill(self):
        generated = self.root / '.dsh-skill-build/targets/v/generated-skill'
        (generated / 'references').mkdir(parents=True)
        (generated / 'maintenance').mkdir()
        (generated / 'SKILL.md').write_text('[topic](references/topic.md#entry)\n')
        (generated / 'references/topic.md').write_text('# Entry\n')
        (generated / 'maintenance/source-map.md').write_text('# Evidence\n')
        (self.refs / 'topic.md').write_text('[broken](missing.md)\n')
        result = self.run_check('--skill', str(generated))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        (generated / 'references/topic.md').write_text('# Changed\n')
        result = self.run_check('--skill', str(generated))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing anchor', result.stdout)

    def test_dsh_source_validation_requires_generated_source_map(self):
        (self.refs.parent / 'maintenance/source-map.md').unlink()
        result = self.run_check('--dsh', str(self.root))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('cannot validate DSH checkout', result.stdout)


if __name__ == '__main__':
    unittest.main()
