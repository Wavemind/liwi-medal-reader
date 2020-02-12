/*eslint-disable */
// TODO this file is in creating !
import React, { Component } from 'react';
import { Slider, View } from 'react-native';
import { Button, Text } from 'native-base';
import { styles } from './Drawer.style';

const Matrix = {
  identify: () => {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  multMatrix: (a, b) => {
    var out = [];
    var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
    // Cache only the current line of the second matrix
    var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return out;
  },

  rotate: (a, rad, axis) => {
    var out = [];
    var x = axis[0],
      y = axis[1],
      z = axis[2],
      len = Math.sqrt(x * x + y * y + z * z),
      s,
      c,
      t,
      a00,
      a01,
      a02,
      a03,
      a10,
      a11,
      a12,
      a13,
      a20,
      a21,
      a22,
      a23,
      b00,
      b01,
      b02,
      b10,
      b11,
      b12,
      b20,
      b21,
      b22;

    if (Math.abs(len) < 0.000001) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  },

  /**
   * 将行列式 转置
   * @param  {[type]} m [description]
   * @return {[type]}   [description]
   */
  transpose: (m) => {
    let [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = m;

    return [m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44];
  },
};

export class DrawerMinify extends Component<{ routeName: string, initialPage: string }> {
  state = {};

  render() {
    let {} = this.props;

    const transformOrigin = [50, -50];
    const translate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, transformOrigin[1], -transformOrigin[1], 0, 1];
    const unUseTranslate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -transformOrigin[1], -transformOrigin[1], 0, 1];
    const a = Math.PI / 3;
    const rotateMatrix = [Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    let m = Matrix.multMatrix(translate, rotateMatrix);

    m = Matrix.multMatrix(m, unUseTranslate);

    return (
      <>
        <Slider style={{ width: 200, height: 40 }} minimumValue={0} maximumValue={1} minimumTrackTintColor="#FFFFFF" maximumTrackTintColor="#000000" />
        <View style={styles.drawerMinifySmallify}>
          <View style={styles.drawerMinifyView}>
            <View style={styles.drawerMinifyWrapButton}>
              <Button style={[styles.drawerMinifyButton, { transform: [{ matrix: m }] }]} onPress={() => console.log('click minify')}>
                <Text style={styles.drawerMinifyText}>Triage</Text>
              </Button>
            </View>
            <View style={styles.drawerMinifyWrapButton}>
              <Button style={[styles.drawerMinifyButton, { transform: [{ matrix: m }] }]} onPress={() => console.log('click minify')}>
                <Text style={styles.drawerMinifyText}>Consultation</Text>
              </Button>
            </View>
            <View style={styles.drawerMinifyWrapButton}>
              <Button style={styles.drawerMinifyButton} onPress={() => console.log('click minify')}>
                <Text style={styles.drawerMinifyText}>Tests</Text>
              </Button>
            </View>
            <View style={styles.drawerMinifyWrapButton}>
              <Button style={styles.drawerMinifyButton} onPress={() => console.log('click minify')}>
                <Text style={styles.drawerMinifyText}>Diagnotics</Text>
              </Button>
            </View>
          </View>
        </View>
      </>
    );
  }
}
