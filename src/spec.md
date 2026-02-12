# Specification

## Summary
**Goal:** Let the user add and persist a customizable multi-line “feelings” paragraph that appears on the celebration screen after clicking “Yes! 💖”.

**Planned changes:**
- Add a multi-line feelings paragraph to the celebration screen’s card, shown after the user clicks “Yes! 💖”, with a default English message when not customized.
- Extend the existing “Customize Your Valentine 💕” panel with a labeled textarea to edit the feelings paragraph, applied via “Apply Changes” and reverted via “Reset to Defaults”.
- Persist the feelings paragraph locally in the browser so it survives refreshes, consistent with existing customization persistence.

**User-visible outcome:** Users can write a personal multi-line message in the customization panel, and after clicking “Yes! 💖” they’ll see it displayed on the celebration screen (and it will still be there after refreshing), with an option to reset back to a default message.
