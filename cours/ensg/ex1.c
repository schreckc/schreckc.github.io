#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

using namespace std;

// ----------------------------------------------------------

int fact(int n) {
  int res = 1;
  for (int i = 2; i <= n; ++i) {
    res *= i;
  }
  return res;
}

int main()
{

  int tbl[16]    = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15};
  int result[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

  // Ex1: create two threads, use both to compute factorial(tbl[]) => result[]
  // result[i] = factorial(tbl[i])
  
  return 0;
}

// ----------------------------------------------------------
