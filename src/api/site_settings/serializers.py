from rest_framework import serializers

from .models import SiteConfig


class SiteConfigSerializer(serializers.ModelSerializer):
    hero_background_image = serializers.ImageField(use_url=True, required=False)
    hero_background_video = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = SiteConfig
        fields = [
            "site_name",
            "tagline",
            "hero_headline",
            "hero_subheadline",
            "hero_media_type",
            "hero_background_image",
            "hero_background_video",
            "about_headline",
            "about_body",
            "contact_email",
            "instagram_url",
        ]
