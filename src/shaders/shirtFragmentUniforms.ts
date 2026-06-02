const shirtFragmentUniforms = /* glsl */ `
#include <uv_pars_fragment>
varying vec2 vRawUv0;
varying vec2 vRawUv1;
uniform sampler2D uBakeNormal;
`;

export { shirtFragmentUniforms };
