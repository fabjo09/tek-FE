# Campus Building Design Notes (Revision 3)

## Concept

An interactive 3D university campus scene featuring a central corridor with accessible rooms, basic textures, and button-based navigation with smooth camera transitions, implemented in Three.js.

## Layout

- **Corridor:** A straight hallway. Dimensions (WxHxL): 4 x 4 x 25 units.
- **Rooms:** Four rooms branching off the corridor (two on each side).
  - **Reception (Left 1):** Dimensions (WxHxD): 6 x 4 x 5 units. Open doorway to corridor.
  - **Classroom (Left 2):** Dimensions (WxHxD): 6 x 4 x 6 units. Open doorway to corridor.
  - **Library (Right 1):** Dimensions (WxHxD): 6 x 4 x 5 units. Open doorway to corridor.
  - **Cafeteria (Right 2):** Dimensions (WxHxD): 6 x 4 x 6 units. Open doorway to corridor.
- **Walls:** Interior and exterior walls defined by BoxGeometry. Thickness: 0.2 units.
- **Floor:** Single plane covering the corridor and room bases.
- **Ceiling:** Single plane covering the corridor and room tops.

## Textures (Using simple CDN links or procedural materials)

- **Corridor Floor:** Simple tile texture.
- **Reception:** Tiled floor, wood texture for desk.
- **Classroom:** Wooden floor, plain white wall for whiteboard area.
- **Library:** Carpet texture floor, wood texture for shelves/table.
- **Cafeteria:** Tiled floor (different from corridor), simple metallic look for counters (if added).
- **Walls:** Default beige/off-white material, possibly different accent walls.

## Room Contents (Simple Placeholders - adjusted positions for new layout)

- **Reception:** Desk, Person Placeholder.
- **Classroom:** Desks (x4), Whiteboard (plane on wall).
- **Library:** Shelves (x3), Table, Chairs (x2).
- **Cafeteria:** Tables (x2), Chairs (x4).

## Navigation & Interaction

- **Controls:** Removed WASD/PointerLock. Replaced with UI buttons.
- **UI Buttons:** HTML buttons: "Go to Reception", "Go to Classroom", "Go to Library", "Go to Cafeteria", "Go to Corridor".
- **Camera Animation:** Smooth camera movement (position and lookAt) to predefined viewpoints for each room/corridor view when a button is clicked. Use an animation library like Tween.js or GSAP (via CDN).
- **Predefined Views:**
  - Corridor: View down the length of the corridor.
  - Reception: View inside the reception area, showing the desk.
  - Classroom: View inside the classroom, facing the whiteboard.
  - Library: View inside the library, showing shelves and table.
  - Cafeteria: View inside the cafeteria.
- **Room Labels:** Use `CSS2DRenderer` and HTML `div` elements positioned near room entrances or inside rooms. Labels: "Reception", "Classroom", "Library", "Cafeteria".
- **UI Overlay:** (Optional - may be less relevant with fixed views) Can be kept to show room name/description when camera arrives.

## Scene Elements

- **Ground:** Simple exterior plane (less emphasis now, view is mostly interior).
- **Lighting:** Ambient light + Directional light (for exterior if visible) + Point lights inside each room and corridor for good interior illumination.

## Implementation Notes

- Import Tween.js (or similar) via CDN in `index.html`.
- Use `TextureLoader` for applying textures from CDN URLs.
- Structure code modularly (scene setup, layout creation, texture loading, camera animation, UI interaction).
- Define target camera states (position, lookAt target) for each button.
- Implement the `animate` function to update the animation tween.
