#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>

using namespace std;

// ----------------------------------------------------------

#define W 230
#define H 100
#define MAX_ITER 2048

// ----------------------------------------------------------

int computeStuff( int i,int j )
{
  double c_re = - 2.0 + 2.7 * i / (double)W;
  double c_im = - 1.5 + 3.0 * j / (double)H;
  double Z_re = c_re;
  double Z_im = c_im;
  int    n = 0;
  for ( ; n < MAX_ITER ; n ++ ) {
    double Z_re2 = Z_re*Z_re;
    double Z_im2 = Z_im*Z_im;
    if(Z_re2 + Z_im2 > 4) {
      break;
    }
    Z_im = 2*Z_re*Z_im + c_im;
    Z_re = Z_re2 - Z_im2 + c_re;
  }
  return n;  
  // thanks to http://warp.povusers.org/Mandelbrot/
}

// ----------------------------------------------------------

void printChar( int c )
{
  char chars[] = {
  ' ','_','.','o', 
  '+','*','0','%', 
  '&','$','@','#'};
  cerr << char(27) << "[" << (30 + (c%7)) << "m";
  cerr << chars[c % 12];
  cerr << char(27) << "[37m";
}

// ----------------------------------------------------------

void display(int *vals)
{
  for (int j = 0; j < H ; j ++) {
    for (int i = 0; i < W ; i ++) {
      printChar( vals[i+j*W] );
    }
    cerr << endl;
  }
}

// ----------------------------------------------------------

int main()
{
  //// CPU single thread version 
  
  int vals[W*H];

  auto start_tm = std::chrono::system_clock::now();

  for (int j = 0; j < H ; j ++) {
    for (int i = 0; i < W ; i++) {
      vals[i+j*W] = computeStuff( i,j );
    }
  }

  auto end_tm = std::chrono::system_clock::now();

  display( vals );

  auto elapsed = std::chrono::duration_cast<std::chrono::microseconds>(end_tm - start_tm).count();
  cerr << "CPU timing: " << elapsed << " us" << endl;

  ////////////////
  return 0;
}
