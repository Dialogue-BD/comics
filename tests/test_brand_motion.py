import unittest

from brand_motion import enhance_html, motion_runtime


class MotionInjectionTests(unittest.TestCase):
    def test_enhances_nested_html_without_rewriting_activity(self):
        original = b"<html><head><title>Classroom</title></head><body>Activity</body></html>"
        result = enhance_html(original)
        self.assertIn(b'href="/dialogue-brand-motion.css"', result)
        self.assertIn(b'defer src="/dialogue-brand-motion.js"', result)
        self.assertTrue(result.endswith(b"<body>Activity</body></html>"))
        self.assertEqual(enhance_html(result), result)

    def test_no_head_does_not_change_other_content(self):
        self.assertEqual(enhance_html(b"not an HTML page"), b"not an HTML page")

    def test_runtime_uses_installed_dependency(self):
        self.assertTrue(motion_runtime(".").is_file())
