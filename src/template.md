# Release - {{ currentDate }}

## Resume
{% for slug, section in sections %}
- **{{ section.title }}:** {{section.size}}{% endfor %}

{% for slug, section in sections %}
## {{ section.title }}

{% for item in section.values %}
- {{ item.title }} [#PR{{ item.id }}]({{ item.links.html.href }}){% else %}Nothing{% endfor %}
{% endfor %}
