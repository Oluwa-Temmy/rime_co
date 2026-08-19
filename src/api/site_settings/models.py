from django.db import models


class SiteConfig(models.Model):
    """Singleton holding site-wide brand copy so nothing is hardcoded in the frontend."""

    site_name = models.CharField(max_length=100, default="Rime Co")
    tagline = models.CharField(max_length=200, blank=True)
    hero_headline = models.CharField(max_length=200, blank=True)
    hero_subheadline = models.CharField(max_length=300, blank=True)
    about_headline = models.CharField(max_length=200, blank=True)
    about_body = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    instagram_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Site configuration"
        verbose_name_plural = "Site configuration"

    def __str__(self) -> str:
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "SiteConfig":
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
