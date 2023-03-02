# Release - {{ currentDate }}

{% for slug, section in sections %}
## {{ section.icon }} {{ section.title }}

{% for item in section.values %}
- {{ item.title }} [#PR{{ item.id }}]({{ item.links.html.href }}){% else %}Nothing{% endfor %}
{% endfor %}