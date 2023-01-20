#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <vector>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int n = 0;
  for (int i = 0; i < 500000 ; i++) {
    n = n + 1;
  }
  
  cerr << "n = " << n << endl;
  return 0;
}

// ----------------------------------------------------------
