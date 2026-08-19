from rest_framework import serializers

from .models import SiteConfig


class SiteConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfig
        fields = [
            "site_name",
            "tagline",
            "hero_headline",
            "hero_subheadline",
            "about_headline",
            "about_body",
            "contact_email",
            "instagram_url",
        ]
